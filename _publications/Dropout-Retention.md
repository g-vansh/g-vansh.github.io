---
title: "Bounded Rationality in Las Vegas: Probabilistic Finite Automata Play Multi-Armed Bandits"
collection: publications
permalink: /publication/UAI
excerpt: 'In this paper, we propose a finite-state protocol that captures a resource-bounded agent in a multi-armed bandit setting. The proposed protoal is nearly-optimal and human-like.'
date: 2020-5-14
venue: '36th Conference on Uncertainty in Artificial Intelligence (UAI)'
prof: "Joseph Y. Halpern"
profurl: "https://www.cs.cornell.edu/home/halpern/"
---
While traditional economics assumes that humans are fully rational agents who always maximize their expected utility, in practice, we constantly observe apparently irrational behavior. One explanation is that people have limited computational power, so that they are, quite rationally, making the best decisions they can, given their computational limitations. To test this hypothesis, we consider the multi-armed bandit (MAB) problem. We examine a simple strategy for playing an MAB that can be implemented easily by a probabilistic finite automaton (PFA). Roughly speaking, the PFA sets certain expectations, and plays an arm as long as it meets them. If the PFA has sufficiently many states, it performs near-optimally. Its performance degrades gracefully as the number of states decreases. Moreover, the PFA acts in a "human-like" way, exhibiting a number of standard human biases, like an optimism bias and a negativity bias.
