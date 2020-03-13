from stimator import read_model

mdl = """
title pandemic SEIVD model

#reactions (with stoichiometry and rate)
exposure: S -> E, rate = tao * S
infection: E -> I, rate = sigma * E
recovery: I -> V, rate = gamma * I
death: I -> D, rate = alpha * I
relapse: V -> S, rate = v * V

## parameters and initial state

# Assume no replapse
v = 0

# https://www.statista.com/statistics/279013/population-in-china-by-region/
init: (S=59170000, E=0, I=0, V=0, D=0)


find tao in [0, 1]
find sigma in [0, 1]
find gamma in [0, 1]
find alpha in [0, 1]
"""

m = read_model(mdl)
best = m.estimate(['hubei.txt'], names=['I', 'D', 'V'])

print(best.info())
best.plot(show=True)
