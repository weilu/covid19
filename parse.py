import pandas as pd
import numpy as np

name_map = {'Confirmed': 'I', 'Deaths': 'D', 'Recovered': 'V'}
data = {}
for key in ('Confirmed', 'Deaths', 'Recovered'):
    df = pd.read_csv(f'data/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-{key}.csv', index_col=(0, 1))
    df.drop(columns=['Lat', 'Long'], inplace=True)
    time_series = df.T[('Hubei', 'Mainland China')]
    if np.isnan(time_series[-1]):
        time_series = time_series[0:-1]
    hubei_data = time_series.astype('long').values
    if 'time' not in data:
        data['time'] = range(0, len(hubei_data))
    data[name_map[key]] = hubei_data

model_data = pd.DataFrame(data=data)
model_data.to_csv('hubei.txt', sep='\t', encoding='utf-8', index=False)
