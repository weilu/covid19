from stimator import read_model
import pandas as pd


# 2018 pop numbers:
# https://www.statista.com/statistics/279013/population-in-china-by-region/
HUBEI_POP = 75560000

# https://countryeconomy.com/demography/population/china
CHINA_POP = 1395380000

# https://www.google.com/publicdata/explore?ds=kf7tgg1uo9ude_&ctype=l&strail=false&bcs=d&nselm=h&met_y=population&scale_y=lin&ind_y=false&rdim=country&idim=country:US&ifdim=country&hl=en&dl=en&ind=false
US_POP = 327167400


# https://www.nytimes.com/2020/03/13/us/coronavirus-deaths-estimate.html
# NY Times: Between 160 million and 214 million people in the United States
def estimate_infected(target_pop):
    hubei_num_infected = get_hubei_infected()
    upper_target_infected = int(hubei_num_infected / HUBEI_POP * target_pop)

    china_num_infected = get_china_infected()
    lower_target_infected = int(china_num_infected / CHINA_POP * target_pop)

    # TODO: add a middle estimate which estmate states with growth factor > 1 using Hubei, the rest using China
    # https://youtu.be/Kas0tIxDvrg?t=354
    return (lower_target_infected, upper_target_infected)


def get_hubei_infected():
    hubei_data = pd.read_csv('hubei.txt', sep='\t')
    return hubei_data['I'].values[-1]


def get_china_infected():
    df = pd.read_csv('data/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv', index_col=(0, 1))
    df.drop(columns=['Lat', 'Long'], inplace=True)
    dft = df.T
    return sum(dft.filter(regex='China').tail(1).T.values)[0]


def build_hubei_model():
    hubei_num_infected = get_hubei_infected()
    mdl = f"""
    title pandemic SEIVD model

    #differentials, assume E(t) = I(t) and no replapse for simplification

    I' = c * (1 - I/{hubei_num_infected}) * I - alpha * I
    V' = gamma * I
    D' = alpha * I

    ## parameters and initial state

    init: (I=0, V=0, D=0)

    find c in [0, 5000]
    find gamma in [0, 1]
    find alpha in [0, 1]
    """

    m = read_model(mdl)
    best = m.estimate(['hubei.txt'], names=['I', 'D', 'V'], opt_settings=dict(max_generations=300))

    print(best.info())
    best.plot(show=True)


if __name__ == "__main__":
    us_infected = estimate_infected(US_POP)
    print(us_infected)
    build_hubei_model()
