# Consumer Complaint Text Classification and Optimization

This project demonstrates a complete end-to-end pipeline for text classification using the Consumer Complaint Database. The task involves analyzing consumer complaints about financial products and services, cleaning and processing text data, engineering additional features, and building multiple classification models to predict complaint categories.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Installation and Requirements](#installation-and-requirements)
- [Usage](#usage)
- [Workflow and Methodology](#workflow-and-methodology)
- [Results and Evaluation](#results-and-evaluation)
- [Future Work](#future-work)
- [License](#license)

## Overview

The goal of this project is to categorize consumer complaints into one of four classes:
- **0:** Credit reporting, repair, or other
- **1:** Debt collection
- **2:** Consumer Loan
- **3:** Mortgage

The pipeline covers:
1. **Exploratory Data Analysis (EDA) and Feature Engineering:**  
   - Data cleaning and summary statistics.
   - Visualizations to explore distributions (e.g., complaint categories, product types, state distributions, and narrative length).
2. **Text Pre-Processing:**  
   - Lowercasing, punctuation removal, stopword filtering, and lemmatization of the complaint narratives.
3. **Feature Extraction:**  
   - Generating TF-IDF features from the processed complaint text.
4. **Model Building and Hyperparameter Optimization:**  
   - Training several classifiers (Logistic Regression, Multinomial Naive Bayes, Linear SVC, Random Forest, Gradient Boosting, and MLP) using GridSearchCV.
5. **Evaluation and Visualization:**  
   - Comparing models with accuracy and confusion matrix visualizations.
6. **Prediction:**  
   - Using the best tuned model to predict the category of new complaint narratives.


## Installation and Requirements

Ensure you have Python 3 installed. The project uses several Python libraries; you can install the required dependencies using pip:

```bash
pip install pandas numpy matplotlib seaborn nltk scikit-learn
```

Before running the notebook, download NLTK stopwords and wordnet resources by running:

```python
import nltk
nltk.download('stopwords')
nltk.download('wordnet')
```

## Usage

1. **Prepare the Dataset:**  
   Place your `consumer_complaints.csv` file in the same directory as the notebook.

2. **Run the Notebook:**  
   Open the `Consumer_Complaint_Text_Classification_VisualEDA.ipynb` notebook in Jupyter Notebook or JupyterLab and run all cells sequentially. The notebook performs EDA, pre-processing, model training, evaluation, and prediction.

3. **Review Visualizations and Results:**  
   The notebook includes several plots for visual EDA and displays performance metrics (accuracy, classification reports, and confusion matrices) for each model.

## Workflow and Methodology

- **Data Cleaning and EDA:**  
  Basic data information is displayed and problematic columns (e.g., `Date received`, `Date sent to company`, `Consumer disputed?`) are dropped. Visualizations help understand data distributions and key feature relationships.

- **Text Pre-Processing:**  
  Complaint narratives are pre-processed to remove noise and prepare them for feature extraction.

- **Feature Extraction:**  
  TF-IDF is applied to the cleaned text data to convert it into a numerical feature matrix.

- **Modeling:**  
  Several classifiers are trained with hyperparameter tuning using GridSearchCV. The best model is selected based on evaluation metrics.

- **Evaluation:**  
  Performance of each model is compared via accuracy and confusion matrix visualizations.

- **Prediction:**  
  A sample complaint narrative is processed and classified using the best tuned model.

## Results and Evaluation

The notebook prints classification reports, accuracy scores, and confusion matrices for all models. Visualizations are provided to compare model performance.


## Conclusion

- **Best Model:** Linear SVC achieved the highest accuracy (**87.23%**), closely followed by Logistic Regression (**86.93%**).
- **Tree-Based Models:** Gradient Boosting (**86.62%**) and Random Forest (**86.02%**) performed well but slightly below linear models.
- **MLP Performance:** Neural Network (MLP) had the lowest accuracy (**85.41%**), possibly due to hyperparameter tuning or data constraints.
- **Class Imbalance Issues:** Class '2' had **zero recall**, indicating poor classification. Techniques like oversampling or class weighting may help.
- **Feature Engineering:** Adding text-based features (n-grams, embeddings) could enhance performance, especially for minority classes.
- **Future Improvements:** Exploring deep learning models (e.g., BERT) may further improve classification results.
