from stimator import read_model

mdl = """
title pandemic SEIVD model

#differentials, assume E(t) = I(t) and no replapse for simplification

I' = c * (1 - I/68656) * I - alpha * I
V' = gamma * I
D' = alpha * I

## parameters and initial state

init: (I=444, V=28, D=17)

find c in [0, 5000]
find gamma in [0, 1]
find alpha in [0, 1]
"""

m = read_model(mdl)
best = m.estimate(['hubei.txt'], names=['I', 'D', 'V'], opt_settings=dict(max_generations=300))

print(best.info())
best.plot(show=True)
