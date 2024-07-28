---
title: "Strategic Treatment Effects"
excerpt: "R Package to Estimate The Strategic Treatment Effects of an experiment using High Dimensional Data<br/><br/><img src='/images/STE.jpeg'>"
collection: portfolio
---

Created an [open-source R package](/STE) from scratch to apply the causal framework developed in [Treatment Effects in Managerial Strategies (Guzman, 2021)](/publication/STE).

The R package does the following:
1. Estimates the propensity of a firm to select into choosing a strategy using a custom-tuned Random Forest model’s 10 fold out-of-fold predictions. 
2. Using the propensity scores generated, we estimate the treatment effects, and subsequently the strategic treatment effects of the strategy chosen under the Rubin Causal Model by running two local regressions (Lowess). 
3. We then understand the determinant resources of the strategic treatment effects using a 10-fold LASSO procedure.
4. We then estimate the value of the coherence of the firm’s resources in generating the competitive advantage.
5. Finally, we try to estimate a benchmark OLS regression to explain the main effects to choose into the strategy to understand how much better our framework is than the standard approach. 
