<img src="./readme/title1.svg"/>

<br><br>

<!-- project overview -->
<img src="./readme/title2.svg"/>

> MindGuard is a wellness and AI-powered platform that tracks daily mood patterns and personal habits.
> It analyzes journal entries, behaviors, and trends to predict emotional states up to 48 hours ahead, providing personalized insights for better self-awareness and mental resilience.

> The app collects and organizes user data, processes it through AI models, and allows users to generate tailored reports that highlight risks, suggest coping strategies, and support proactive mental health management.

<br><br>

<!-- System Design -->
<img src="./readme/title3.svg"/>

### ER Diagram

- <img src="./readme/demo/ER diagram.png"/>

### Component Diagram

- <img src="./readme/demo/Component Diagram.png"/>

<br><br>

<!-- Project Highlights -->
<img src="./readme/title4.svg"/>

### The Journey of the Sexy Features

- Seamless Calendar Syncing: The platform integrates with personal calendars to align daily schedules with mood predictions, helping users plan activities at times when they are most likely to feel energized and focused.

- End-to-End MLflow Tracking: Every machine learning experiment, model version, and deployment is automatically tracked with MLflow, ensuring reproducibility, transparency, and continuous improvement of predictive insights.

- Autonomous AI Agent: A robust AI agent analyzes journal entries and behavioral signals, delivering real-time mood assessments, personalized recommendations, and early risk detection for better mental health management.

- Predictive ML Modeling: Advanced machine learning models process historical mood and habit data to forecast emotional states up to 48 hours ahead, empowering users with foresight into their mental well-being.

- Automated n8n Workflows: Integrated with n8n, the system automates data pipelines and report generation—streamlining routine tasks, sending timely alerts, and connecting MindGuard to external services with minimal effort.

### Feature Diagram

<img src="./readme/demo/Feature Diagram.png"/>
<br><br>

<!-- Demo -->
<img src="./readme/title5.svg"/>

### User Screens (Mobile)

| Landing screen                            | Login screen                          | Register screen                             |
| ----------------------------------------- | ------------------------------------- | ------------------------------------------- |
| ![Landing](./readme/demo/LandingPage.jpg) | ![Login](./readme/demo/LoginPage.jpg) | ![Register](./readme/demo/RegisterPage.jpg) |

| Home screen                         | Journal and Insight Screens           | Mood Map screen                   |
| ----------------------------------- | ------------------------------------- | --------------------------------- |
| ![Home](./readme/demo/HomePage.jpg) | ![AI and ML](./readme/demo/AI_ML.gif) | ![Map](./readme/demo/MapPage.jpg) |

| Routine screen                                          | Profile screen                            | Dark Mode                           |
| ------------------------------------------------------- | ----------------------------------------- | ----------------------------------- |
| ![Calendar syncing](./readme/demo/Calendar_syncing.gif) | ![Profile](./readme/demo/ProfilePage.jpg) | ![Dark](./readme/demo/darkmode.gif) |

### Admin Screens (Web)

| Landing screen                        |
| ------------------------------------- |
| ![Landing](./readme/demo/Landing.gif) |

### Automation Workflow

| N8N Workflow                       | N8N Workflow                             |
| ---------------------------------- | ---------------------------------------- |
| ![Workflow](./readme/demo/N8N.png) | ![Workflow](./readme/demo/N8N_Email.jpg) |

### MLFlow

| MLFlow UI                                |
| ---------------------------------------- |
| ![MLFlow](./readme/demo/MLFlow_demo.gif) |

<br><br>

<!-- Development & Testing -->
<img src="./readme/title6.svg"/>

### Services

| Service                               |
| ------------------------------------- |
| ![Service](./readme/demo/Service.png) |

### Validation

| Validation                                  |
| ------------------------------------------- |
| ![Validation](./readme/demo/Validation.png) |

### Testing

| Test Case                           | Test Case                           |
| ----------------------------------- | ----------------------------------- |
| ![Test](./readme/demo/Testing1.png) | ![Test](./readme/demo/Testing2.png) |

### Linear

| Linear Workflow                             |
| ------------------------------------------- |
| ![Linear](./readme/demo/LinearWorkflow.png) |

### Pull Requests

| Frontend CI                        | Backend CI                        |
| ---------------------------------- | --------------------------------- |
| ![Frontend](./readme/demo/CI1.png) | ![Backend](./readme/demo/CI2.png) |

### Swagger

- Testing Apis responses using swagger and ensuring their optimization.

| Swagger APIS                               | Swagger Docs                               |
| ------------------------------------------ | ------------------------------------------ |
| ![Swagger](./readme/demo/swagger_apis.png) | ![Swagger](./readme/demo/swagger_docs.png) |

### AI Agent

- Writing – The user writes a diary note about how they feel.

- Check Memory – The system sees if it already analyzed this note before.

- Ask AI – It sends the text to Gemini, asking only for the mood (happy, sad, stressed, etc.) and a score from –5 (very negative) to +5 (very positive).

- Double-Check – The system makes sure Gemini’s answer is clear and valid.

- Common Sense Scan – It also looks for strong words (like “panic” or “joy”) to adjust the mood if needed.

- Final Choice – It combines Gemini’s answer and the common sense check to be extra accurate.

- Result – The system gives back a simple answer, like:
  → Mood: Stressed
  → Score: –3

### ML Dataset

Our dataset was built from two sources: publicly available mood-annotated text corpora and realistic journal-like entries generated in the app. Each entry contains a mood label (from 11 moods such as anxiety, stress, happy, calm, etc.), a sentiment score, and timestamps.

We created two versions of the dataset:

Tabular dataset (V1): Predicts risk level (LOW, MEDIUM, HIGH) based on a single mood and sentiment score. This provided a simple baseline.

Sequence dataset (V2): Uses the past 7 days of moods and sentiment scores to predict if the next 48 hours are at risk or OK. This reflects real-life mood tracking more closely.

To ensure balance, class weighting was applied during training. Importantly, no personal data or raw journal text is used — only mood categories and numeric sentiment scores. Labels are derived from proxy rules, so results should be seen as supportive insights rather than medical advice.

### ML Metrics

| ML Metrics                              |
| --------------------------------------- |
| ![Metrics](./readme/demo/MLmetric1.png) |
| ![Metrics](./readme/demo/MLmetric2.png) |
| ![Metrics](./readme/demo/MLmetric3.png) |

<br><br>

<!-- Deployment -->
<img src="./readme/title7.svg"/>

### Deployment Map

| Deployment Map                                 |
| ---------------------------------------------- |
| ![Map](./readme/demo/Deployment%20Diagram.png) |

<br><br>
