---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

[View A PDF Copy]()

Education
======
* **B.S. in Biometry and Statistics, Cornell University, 2023**
  * GPA - 3.95 (Magna Cum Laude)
  * Concentrations:
    * Mathematical Statistics
    * Computational Statistics & Data Management
* **B.S. in Applied Economics and Management, Cornell University, 2023**
  * GPA - 3.92 (Magna Cum Laude)
  * Dyson Diversity Scholar
  * Research Honors (Distinction) in Social Science

Research Interests & Experience
======
* **Innovation \| Strategy \| Science of Science** \[2 Projects; 2 Years\]
* **Urban & Transport \| Industrial Organization** \[2 Projects; 2 Years\]
* **Development \| Education \| Healthcare** \[4 Projects; 4 Years\]

Relevant Coursework
======
* **Graduate Mathematics**
  * [Real Analysis](https://classes.cornell.edu/browse/roster/FA22/class/MATH/6110) (A) \| [Honors Introduction to Analysis](https://classes.cornell.edu/browse/roster/SP22/class/MATH/4130) (A+) \| [Stochastic Processes](https://classes.cornell.edu/browse/roster/SP22/class/ORIE/3510)
* **(Theory) Statistics**
  * [Econometrics](https://classes.cornell.edu/browse/roster/SP22/class/ECON/3140) \| [Theory of Statistics](https://classes.cornell.edu/browse/roster/SP23/class/BTRY/4090) \| [Advanced Biological Statistics](https://classes.cornell.edu/browse/roster/SP23/class/BTRY/3020) \| [Probability & Statistical Inference](https://classes.cornell.edu/browse/roster/FA21/class/ECON/3130) 
* **(Applied) Statistics**
  * [Statistical Computing](https://classes.cornell.edu/browse/roster/SP23/class/STSCI/4520) \| [Risk Simulation & Monte Carlo Methods](https://classes.cornell.edu/browse/roster/SP23/class/AEM/4060) \| [Computing using MATLAB](https://classes.cornell.edu/browse/roster/FA20/class/CS/1112) \| [Analytic Modelling](https://test-classes.ssit.cucloud.net/browse/roster/FA22/class/AEM/3030)
* **Computer Science**
  *  [Object-Oriented Programming & Data Structures](https://classes.cornell.edu/browse/roster/FA21/class/CS/2110) \| [Database Management](https://classes.cornell.edu/browse/roster/FA21/class/AEM/2820) 
* **Fundamental Mathematics & Economics** 
  * [Linear Algebra](https://classes.cornell.edu/browse/roster/FA20/class/MATH/2210) \| [Multivariable Calculus](https://classes.cornell.edu/browse/roster/SP21/class/MATH/2220) \| [International Trade & Finance](https://classes.cornell.edu/browse/roster/SP23/class/AEM/2300) \| [Intermediate Microeconomics](https://classes.cornell.edu/browse/roster/FA22/class/AEM/4100) \| [Intro Microeconomics](https://classes.cornell.edu/browse/roster/FA20/class/ECON/1110) \| [Intro Macroeconomics](https://www3.tc3.edu/mcs/2023-24/ECON121.pdf)
* **Strategy, Business, & Law**
  * [Strategy](https://classes.cornell.edu/browse/roster/SP22/class/AEM/2601) \| [Finance](https://classes.cornell.edu/browse/roster/SP22/class/AEM/2240) \| [Business Law](https://classes.cornell.edu/browse/roster/FA22/class/AEM/3200)

Research Experience
======
* **Research Assistant, Cornell University** (Spring 2021 - Present)
  * Worked under the guidance of [Daniela Scur](https://www.danielascur.com), co-authoring with [Michel Best](https://blogs.cuit.columbia.edu/mcb2270/) and [Renata Lemos](https://renatalemos.com/), leading the data collection and processing for [State Capacity and Responses to Natural Disasters: Evidence from Brazilian Municipalities](/publication/Diario-Municipal).
  * Successfully web-scraped ~25 million PDF files in Portuguese, and processed them.
  * Converted the complicated and unstructured PDFs into more accessible .csv files for further analysis.
  * Created topic models to classify text data using the LDA algorithm.

* **Dean's Summer Research Fellow, Columbia Business School** (Summer 2022 - Present)
  * Worked under the guidance of [Jorge Guzman (Columbia Business School)](https://www.jorgeguzman.co/), co-authoring with [Maria Roche (Harvard Business School)](https://www.hbs.edu/faculty/Pages/profile.aspx?facId=1284955) and [Annamaria Conti (IE Business School)](https://sites.google.com/view/annamariaconti/home-page) for [Incentivizing Innovation in Open Source: Evidence from the GitHub Sponsors Program](https://www.nber.org/papers/w31668).
  * Created data pipelines and authored an [open-source R package (STE)](/STE).
  * Worked on projects in [Strategy, Entrepreneurship](/publication/STE), and [Digital Innovation](/publication/Sponsoring-Innovation).

* **Data Reproducibility Researcher, American Economic Association** (Summer 2021)
  * Responsible for reproducing results in manuscripts submitted for review to AEA journals under the [AEA Data Editor, Lars Vilhuber](https://www.vilhuber.com/lars).
  * [Debugged and reproduced code](/publications/AEA-Data) in 30+ manuscripts, and verified the validity of the data. Generated reports of the replication process, which were then used to make the review decision for the manuscripts.  
  * Authored an [open-source data utility tool](https://github.com/AEADataEditor/Upload-to-Zenodo) which is used by AEA to upload their reproduction files to Zenodo. 

* **Research Assistant, Cornell University** (Spring 2021)
  * Worked under the guidance of [Reza Moghimi](https://dyson.cornell.edu/faculty-research/faculty/am2393/), studying [Twitter sentiment’s effects on the financial markets](/publication/NLP). 
  * Carried out literature reviews for the paper, studying NLP algorithms to understand which one would be the most effective for our use case.
  * Helped in the development of Python code to collect the data and conduct the analysis.

Research Projects
======
  <ul>{% assign sorted_publications = site.publications | sort: 'date' | reverse %}
{% for post in sorted_publications %}
  {% include archive-single.html %}
{% endfor %}</ul>
  
Talks
======
  <ul>{% for post in site.talks %}
    {% include archive-single-talk-cv.html %}
  {% endfor %}</ul>
  
Teaching
======
  <ul>{% for post in site.teaching %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>

Software Development
======
* [**\[Open Source\]** R Package: STE](/STE)
  * R Package to implement the framework developed in [Treatment Effects in Managerial Strategies](/publication/STE), using machine learning in a causal inference setup.
* [**\[Open Source\]** Python: Upload-To-Zenodo](https://github.com/AEADataEditor/Upload-to-Zenodo)
  * Python code to parse directories and upload the code to Zenodo. This is used by the AEA replication team for smoother synchronisation of their files. 

Professional Work Experience
======
* [Charles River Associates (Antitrust & Competition Economics)](https://www.crai.com/)
  * **_Associate & Data Scientist_** (June 2023 - Present)
  * Produce economic analyses evaluating the competitive effects of healthcare mergers in the US, building on research from industrial economics, urban economics, and healthcare economics.
  * Author white-papers presented to the U.S. Department of Justice and juries to discuss the efficacy of legal frameworks that govern antitrust enforecement policies in the US for the healthcare industry.
  * Hold a dual role as a data scientist/software engineer as well, creating interactive EXE tools to enable economic analyses with large scale data with ease.
  * Assist with the adoption of cloud computing practices for economic analyses involving big data. 
* Ascenta Management Consulting
  * **_Founder & CEO_** (August 2019 - May 2023)
  * Recognized as [India’s Top 10 Consultants (CEOInsights Mag)](https://www.bit.ly/3PapBDy)
  * Headed teams of volunteer consultants working pro-bono with local Indian Small and Medium Enterprises to improve their operations workflows, cut costs, expand their clientele, and provide effective data-driven marketing strategies.
  * Consulted 20+ local businesses using data-backed insights to aid resource mobilization and advance the expansion of revenue streams for the firms – raising revenues for our customers by an average of 28% in a 4-month project period.
* [Cornell Business Analytics](https://www.cornellbusinessanalytics.com)
  * **_Vice President_** (August 2020 - May 2023)
  * Motivate team-members to ensure the nurturing of innovative ideas and the timely delivery of deliverables.
  * Lead a team of 30 analysts to organize the recruitment screening of 180+ applicants, designing innovative challenges.
  * Optimized inventory management for an MNC using management science theory and MS Excel and JavaScript.
  * Leveraged data to create visual insights and Tableau dashboards for a startup to establish hotspots for its launch.
* [Meta](https://about.facebook.com)
  * **_Big Data & Market Intelligence Analyst Extern_** (February 2022 - May 2022)
  * Collaborated with teams to use data-driven insights for suggesting clients to Meta’s Global Business Group.
  * Innovated machine learning models (k-means clustering & random forests) for insights and predictive analytics.
  * Consulted for internal teams in Meta, curating a client acquisition strategy for the Small Business Clients Group.
* [Grant Thornton International LLP](https://www.grantthornton.in)
  * **_Research Trainee – Global Research Centre_** (December 2018 - January 2019)
  * Developed a database of client information in order to streamline communication across Grant Thornton India by leveraging Capital-IQ and Avention databases, implementing a heavy use of SQL and VBA for business analytics.
  * Analysed companies to profile their strategies and risks to produce thorough SWOT analyses for industries GT India’s clients operate in, while consulting with Australian clients and compiling market-competition research reports for them.

Coding Skills
======
* **Scripting Languages**
  * Python \| Java \| Visual Basic (VBA) \| JavaScript (Intermediate)
* **Statistical Analysis**
  * STATA \| MATLAB \| R
* **Mapping & Spatial Data**
  * ArcGIS Pro \| Google Maps API \| Folium/Leaflet (Interactive Maps)
* **Data Scraping**
  * PDFPlumber \| BeautifulSoup \| Selenium
* **Big Data & Data Management**
  * Microsoft Azure \| Databricks \| SQL \| GraphQL \| Excel \| Google Cloud \| Microsoft PowerBI (Intermediate)
* **Data Visualisation**
  * Tableau \| Adobe InDesign

Honors & Media Coverage
======
* Distinction in Social Science research, with Magna Cum Laude honors at Cornell University.
* Recognised as one of [India’s Top 10 Business Consultants](https://www.ceoinsightsindia.com/magazines/leaders-in-business-consultants-june-2022/#page=42) by CEOInsights Magazine India for my work with Ascenta Consulting.
* Research covered in the [NBER Bulletin on Entrepreneurship](https://www.nber.org/be/20241/open-source-software-creators-its-not-just-about-money).
* Research covered in the [Harvard Business School Working Knowledge Newsletter](https://hbswk.hbs.edu/item/intrinsic-joy-sparks-ideas-better-than-cash).
* Dean’s List for all my semesters at Cornell University. 
