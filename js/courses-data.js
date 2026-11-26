// ThinkToSkill Virtual Academy - Specialized Data, AI, Cloud & DevOps Curriculum (India)

// 1. Exact 17 Skills Matrix specified by user
const SKILLS_LIST = [
  {
    name: "Data Analytics",
    icon: "📊",
    category: "Analytics",
    badge: "High Demand",
    desc: "Exploratory data analysis, business KPIs, statistical insights, data cleaning, and executive reporting."
  },
  {
    name: "Data Science",
    icon: "🔬",
    category: "Data",
    badge: "Core Career",
    desc: "Predictive modeling, statistical inference, feature engineering, hypothesis testing, and algorithmic decision making."
  },
  {
    name: "Artificial Intelligence (AI)",
    icon: "🤖",
    category: "AI & ML",
    badge: "Trending 2026",
    desc: "Autonomous intelligent systems, Generative AI fundamentals, prompt engineering, and intelligent workflow automation."
  },
  {
    name: "Machine Learning (ML)",
    icon: "🧠",
    category: "AI & ML",
    badge: "In-Demand",
    desc: "Supervised and unsupervised learning, regression, classification, random forests, XGBoost, and model evaluation."
  },
  {
    name: "Deep Learning",
    icon: "⚡",
    category: "AI & ML",
    badge: "Advanced",
    desc: "Artificial Neural Networks (ANN), CNNs for computer vision, RNNs and Transformer foundations for NLP."
  },
  {
    name: "Cloud Computing",
    icon: "☁️",
    category: "Cloud",
    badge: "Enterprise",
    desc: "Cloud infrastructure architecture, IaaS/PaaS models, elastic scaling, security, and multi-region deployments."
  },
  {
    name: "DevOps",
    icon: "🔄",
    category: "DevOps",
    badge: "In Demand",
    desc: "CI/CD automation, infrastructure as code, release engineering, and site reliability principles."
  },
  {
    name: "Python Programming",
    icon: "🐍",
    category: "Programming",
    badge: "Essential",
    desc: "Core & advanced Python, OOPs, data structures, algorithms, automation scripting, NumPy and Pandas."
  },
  {
    name: "SQL / Databases",
    icon: "🗄️",
    category: "Databases",
    badge: "Foundational",
    desc: "Complex queries, multi-table joins, window functions, CTEs, indexing, performance tuning, and schema design."
  },
  {
    name: "Excel (Advanced)",
    icon: "📈",
    category: "Analytics",
    badge: "Business Standard",
    desc: "Advanced formulas (XLOOKUP, INDEX-MATCH), pivot tables, Power Query data transformation, and dynamic dashboards."
  },
  {
    name: "Power BI / Tableau",
    icon: "📊",
    category: "Visualization",
    badge: "Corporate BI",
    desc: "Interactive business intelligence dashboards, DAX formulas, Power BI reports, and Tableau storytelling."
  },
  {
    name: "Git & GitHub",
    icon: "🐙",
    category: "Version Control",
    badge: "Industry Standard",
    desc: "Source code versioning, commit workflows, branch management, pull requests, and collaborative team repositories."
  },
  {
    name: "Linux Basics",
    icon: "🐧",
    category: "OS & Systems",
    badge: "Core Infra",
    desc: "Command-line navigation, file systems, permissions (chmod/chown), process management, and Bash automation."
  },
  {
    name: "Docker & Kubernetes (Basics)",
    icon: "🐳",
    category: "Containers",
    badge: "Cloud-Native",
    desc: "Building container images, Dockerfiles, multi-container compose, and fundamental Kubernetes Pod/Service concepts."
  },
  {
    name: "AWS",
    icon: "☁️",
    category: "Cloud Provider",
    badge: "Market Leader",
    desc: "Amazon Web Services: EC2 compute, S3 storage, RDS databases, IAM security, VPC networking, and CloudWatch."
  },
  {
    name: "Jupyter Notebook",
    icon: "📓",
    category: "Tools & IDE",
    badge: "Data Science IDE",
    desc: "Interactive coding, cell execution, data visualization inline plotting, exploratory analysis, and report generation."
  },
  {
    name: "VS Code",
    icon: "💻",
    category: "Tools & IDE",
    badge: "Developer Tool",
    desc: "Visual Studio Code environment, debugging, Python & Docker extensions, Git integration, and terminal workflows."
  },
  {
    name: "SAP S/4HANA Finance",
    icon: "💳",
    category: "Enterprise ERP",
    badge: "Corporate Demand",
    desc: "Universal Journal (ACDOCA), General Ledger, Accounts Payable/Receivable, Asset Accounting, Cost Center Accounting & SAP Fiori."
  },
  {
    name: "SAP S/4HANA Material Management (MM)",
    icon: "📦",
    category: "Enterprise ERP",
    badge: "Supply Chain Standard",
    desc: "Procure-to-Pay (P2P), Material Master, Purchasing, Inventory Management (MIGO), Invoice Verification (MIRO), and FI integration."
  }
];

// 2. Structured Course Programs
const COURSES_DATA = [
  {
    id: "data-analytics-bi",
    title: "Data Analytics & Business Intelligence Masterclass",
    category: "data-analytics",
    badge: "Most Popular for Freshers",
    duration: "4 Months (16 Weeks)",
    mode: "100% Live Interactive Virtual",
    batchType: "Weekday & Weekend Batches",
    rating: 4.93,
    reviewsCount: 1640,
    shortDesc: "Master Advanced Excel, SQL / Databases, Power BI, Tableau, Python for analytics, and Git & GitHub with hands-on corporate case studies.",
    overview: "Designed to transform graduates and working professionals into job-ready Business Analysts and Data Analysts in India. You will learn to extract raw data using SQL, analyze it using Advanced Excel and Python, and create executive-ready dashboards in Power BI and Tableau.",
    admissionStatus: "Admissions Open",
    batchSchedule: "Weekday & Weekend Batches",
    placementSupport: "Dedicated Placement Drives",
    nextBatch: "Starts This Monday & Saturday",
    hirers: ["Deloitte", "EY", "KPMG", "PwC", "Accenture", "Swiggy", "Mu Sigma"],
    tools: [
      "Excel (Advanced)",
      "SQL / Databases",
      "Power BI / Tableau",
      "Python Programming",
      "Git & GitHub",
      "VS Code"
    ],
    careerRoles: [
      "Data Analyst",
      "Business Intelligence (BI) Developer",
      "MIS Executive & Reporting Analyst",
      "Operations Data Specialist"
    ],
    curriculum: [
      {
        module: "Module 1: Advanced Excel for Business & Financial Analytics",
        duration: "Weeks 1-3",
        topics: [
          "Data Cleaning, Text Functions & Logical Operators (IF, IFS, AND, OR)",
          "Dynamic Lookups: XLOOKUP, INDEX, MATCH, OFFSET",
          "Advanced Pivot Tables, Calculated Fields & Slicers",
          "Power Query for automated ETL and multi-sheet data transformation",
          "Building Executive KPI Summary Dashboards"
        ]
      },
      {
        module: "Module 2: SQL & Relational Databases for Analytics",
        duration: "Weeks 4-7",
        topics: [
          "RDBMS Fundamentals, Relational Schemas & PostgreSQL / MySQL Setup",
          "Data Query Language: SELECT, WHERE, GROUP BY, HAVING, ORDER BY",
          "Multi-table Joins (INNER, LEFT, RIGHT, FULL OUTER, CROSS)",
          "Advanced SQL: Subqueries, Common Table Expressions (CTEs)",
          "Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE(), LEAD() & LAG()",
          "Database Views, Stored Procedures & Query Optimization"
        ]
      },
      {
        module: "Module 3: Business Intelligence with Power BI & Tableau",
        duration: "Weeks 8-12",
        topics: [
          "Connecting to SQL Databases, Excel & Web data sources",
          "Data Modeling, Star Schema & Snowflake Schema in Power BI",
          "DAX Measures & Calculated Columns (CALCULATE, RELATED, FILTER, Time Intelligence)",
          "Creating Interactive Reports: Bar, Line, Heatmaps, Treemaps & Custom Visuals",
          "Tableau Desktop: Calculated Fields, Level of Detail (LOD) Expressions & Stories",
          "Publishing to Power BI Service & Tableau Public Cloud"
        ]
      },
      {
        module: "Module 4: Python for Analytics, Git & Capstone Project",
        duration: "Weeks 13-16",
        topics: [
          "Python Basics in VS Code & Jupyter Notebook for Data Analysts",
          "NumPy & Pandas for automated data wrangling",
          "Data Visualizations with Matplotlib & Seaborn",
          "Version Control with Git & GitHub repository showcase",
          "Live Capstone: End-to-End E-Commerce Sales & Customer Churn BI Dashboard"
        ]
      }
    ],
    projects: [
      "Indian Retail Chain Sales Performance Dashboard in Power BI with DAX",
      "Banking Credit Card Churn & Delinquency Analysis using SQL & Tableau",
      "Automated Supply Chain KPI Reporting Engine using Python & Advanced Excel"
    ]
  },
  {
    id: "data-science-ml",
    title: "Data Science & Machine Learning (ML) Engineering Program",
    category: "data-science",
    badge: "Highest Hiring Demand",
    duration: "6 Months (24 Weeks)",
    mode: "100% Live Interactive Virtual",
    batchType: "Weekday & Weekend Batches",
    rating: 4.96,
    reviewsCount: 1980,
    shortDesc: "Master Python Programming, SQL / Databases, Jupyter Notebook, VS Code, Scikit-learn, statistical modeling, and production Machine Learning pipelines.",
    overview: "The quintessential curriculum for aspiring Data Scientists and ML Engineers in India. Master the mathematics, statistics, data pipelines, and machine learning algorithms that power modern recommendation engines, fraud detection systems, and predictive models.",
    admissionStatus: "Admissions Open",
    batchSchedule: "Weekday & Weekend Batches",
    placementSupport: "Dedicated Placement Drives",
    nextBatch: "Starts Next Tuesday & Weekend",
    hirers: ["Amazon", "Flipkart", "Tiger Analytics", "Fractal", "Infosys", "PhonePe"],
    tools: [
      "Python Programming",
      "SQL / Databases",
      "Jupyter Notebook",
      "VS Code",
      "Git & GitHub",
      "Data Science",
      "Machine Learning (ML)"
    ],
    careerRoles: [
      "Data Scientist",
      "Machine Learning Engineer",
      "Applied Data Scientist",
      "Predictive Analytics Consultant"
    ],
    curriculum: [
      {
        module: "Module 1: Python Programming & Environment Setup (VS Code & Jupyter)",
        duration: "Weeks 1-4",
        topics: [
          "Python Syntax, Data Structures (Lists, Tuples, Dictionaries, Sets)",
          "Object-Oriented Programming (Classes, Objects, Inheritance) in Python",
          "Environment Configuration in VS Code, Virtual Envs & Jupyter Notebooks",
          "Git & GitHub essentials for versioning research code and notebooks"
        ]
      },
      {
        module: "Module 2: Mathematics, Statistics & Advanced SQL for Data Science",
        duration: "Weeks 5-8",
        topics: [
          "Linear Algebra: Matrices, Vectors, Eigenvalues & Dot Products",
          "Descriptive & Inferential Statistics, Normal Distribution, Central Limit Theorem",
          "Hypothesis Testing (Z-test, T-test, ANOVA, Chi-Square)",
          "Complex SQL joins, aggregation, and feature extraction from relational DBs"
        ]
      },
      {
        module: "Module 3: Data Wrangling & Exploratory Data Analysis (EDA)",
        duration: "Weeks 9-12",
        topics: [
          "Vectorized array manipulation with NumPy",
          "High-performance data manipulation with Pandas",
          "Handling missing values, outlier detection & categorical encoding",
          "Data visualization with Matplotlib, Seaborn & Plotly interactive charts"
        ]
      },
      {
        module: "Module 4: Supervised & Unsupervised Machine Learning (ML)",
        duration: "Weeks 13-18",
        topics: [
          "Supervised Learning: Linear Regression, Ridge, Lasso, Logistic Regression",
          "Decision Trees, Random Forests, Gradient Boosting & XGBoost",
          "Unsupervised Learning: K-Means Clustering, Hierarchical Clustering, PCA",
          "Model Evaluation Metrics: Confusion Matrix, ROC-AUC, F1-Score, Cross-Validation",
          "Hyperparameter Tuning with GridSearchCV and Optuna"
        ]
      },
      {
        module: "Module 5: End-to-End ML Pipeline & Deployment",
        duration: "Weeks 19-24",
        topics: [
          "Scikit-Learn Pipelines & ColumnTransformers for leak-free workflows",
          "Model Serialization with Pickle and Joblib",
          "Serving ML Models with FastAPI / Flask APIs in VS Code",
          "Live Capstone: Real Estate Price Prediction & Indian Stock Trend Forecasting"
        ]
      }
    ],
    projects: [
      "Loan Default & Credit Risk Prediction System for Indian FinTechs",
      "E-Commerce Customer Churn Prediction & Retention Engine with XGBoost",
      "Healthcare Disease Risk Classifier with Hyperparameter Optimization"
    ]
  },
  {
    id: "ai-deep-learning",
    title: "Artificial Intelligence (AI) & Deep Learning Master's",
    category: "ai-ml",
    badge: "Trending 2026",
    duration: "6 Months (26 Weeks)",
    mode: "100% Live Interactive Virtual",
    batchType: "Weekend & Evening Batches",
    rating: 4.95,
    reviewsCount: 1420,
    shortDesc: "From Artificial Intelligence (AI) fundamentals to Deep Learning, Neural Networks, Computer Vision, NLP, and AWS cloud model training.",
    overview: "Step into the cutting edge of modern AI. Learn the inner workings of deep neural networks, computer vision (CNNs), natural language processing (RNNs, Transformers), and how to train and deploy deep learning models on cloud compute instances using AWS and Jupyter Notebook.",
    admissionStatus: "Admissions Open",
    batchSchedule: "Weekday & Weekend Batches",
    placementSupport: "Dedicated Placement Drives",
    nextBatch: "Starts Saturday (Weekend Batch)",
    hirers: ["Google India", "Microsoft", "Amazon", "Wipro AI", "TCS Research", "NVIDIA Partners"],
    tools: [
      "Artificial Intelligence (AI)",
      "Machine Learning (ML)",
      "Deep Learning",
      "Python Programming",
      "AWS",
      "Jupyter Notebook",
      "VS Code",
      "Git & GitHub"
    ],
    careerRoles: [
      "Artificial Intelligence (AI) Engineer",
      "Deep Learning Specialist",
      "Computer Vision Engineer",
      "NLP Research Associate"
    ],
    curriculum: [
      {
        module: "Module 1: AI Foundations & Deep Learning Mathematics",
        duration: "Weeks 1-4",
        topics: [
          "History & Principles of Artificial Intelligence (Search, Heuristics, Agents)",
          "Multivariate Calculus, Gradients & Chain Rule for Backpropagation",
          "Python & Vectorized Deep Learning computations in Jupyter Notebook and VS Code",
          "Git & GitHub branching for model experiments"
        ]
      },
      {
        module: "Module 2: Artificial Neural Networks (ANN) & PyTorch / TensorFlow",
        duration: "Weeks 5-9",
        topics: [
          "Perceptron, Multi-Layer Perceptrons (MLP), Activation Functions (ReLU, Sigmoid, Softmax)",
          "Loss Functions, Optimizers (Adam, RMSprop, SGD) & Learning Rate Schedulers",
          "Combating Overfitting: Dropout, L1/L2 Regularization, Batch Normalization",
          "PyTorch / Keras Tensor Operations and Dataset Loaders"
        ]
      },
      {
        module: "Module 3: Computer Vision with Convolutional Neural Networks (CNN)",
        duration: "Weeks 10-14",
        topics: [
          "Convolution, Pooling layers, Feature Maps & Kernel filters",
          "Classical Architectures: ResNet, VGG, MobileNet, EfficientNet",
          "Transfer Learning & Fine-Tuning pretrained vision models",
          "Object Detection Basics with YOLO & Image Segmentation"
        ]
      },
      {
        module: "Module 4: Natural Language Processing (NLP) & Transformer Foundations",
        duration: "Weeks 15-20",
        topics: [
          "Text Preprocessing: Tokenization, Stemming, Lemmatization & Embeddings (Word2Vec)",
          "Recurrent Neural Networks (RNN) and Long Short-Term Memory (LSTM)",
          "The Transformer Revolution: Self-Attention Mechanisms, Encoders & Decoders",
          "Introduction to Generative AI, Large Language Models (LLMs) & Prompt Engineering"
        ]
      },
      {
        module: "Module 5: Cloud AI on AWS & Production Capstone",
        duration: "Weeks 21-26",
        topics: [
          "Launching GPU training instances on AWS (EC2 G4/G5 instances)",
          "Storage of datasets in AWS S3 & model checkpoints",
          "Packaging deep learning models with Docker in VS Code",
          "Live Capstone: Multimodal Medical Diagnostic Image Classification & Sentiment AI"
        ]
      }
    ],
    projects: [
      "Automated X-Ray & MRI Defect Detection using Deep Convolutional Neural Networks",
      "Real-Time Video Facial Emotion & Attention Tracking System",
      "Financial Document Intelligence & Automated Text Summarization Engine"
    ]
  },
  {
    id: "cloud-devops-aws",
    title: "Cloud Computing (AWS) & DevOps Engineering Bootcamp",
    category: "cloud-devops",
    badge: "Highest Placement Rate",
    duration: "5 Months (22 Weeks)",
    mode: "100% Live Interactive Virtual",
    batchType: "Weekday & Weekend Batches",
    rating: 4.94,
    reviewsCount: 1350,
    shortDesc: "Master Cloud Computing, DevOps, AWS services, Linux Basics, Docker & Kubernetes (Basics), Git & GitHub, and CI/CD pipelines in VS Code.",
    overview: "Every tech firm in India requires engineers who can deploy, orchestrate, and maintain resilient cloud infrastructure. This bootcamp takes you from Linux terminal basics to full AWS cloud architecture, containerization with Docker, and foundational Kubernetes cluster deployments.",
    admissionStatus: "Admissions Open",
    batchSchedule: "Weekday & Weekend Batches",
    placementSupport: "Dedicated Placement Drives",
    nextBatch: "Starts Next Wednesday",
    hirers: ["Amazon Web Services", "TCS Cloud", "Wipro", "Capgemini", "LTIMindtree", "Cognizant"],
    tools: [
      "Cloud Computing",
      "DevOps",
      "AWS",
      "Linux Basics",
      "Docker & Kubernetes (Basics)",
      "Git & GitHub",
      "VS Code"
    ],
    careerRoles: [
      "Cloud Engineer",
      "DevOps Engineer",
      "AWS Cloud Solutions Associate",
      "Linux Systems & Infrastructure Admin"
    ],
    curriculum: [
      {
        module: "Module 1: Linux Basics & Command-Line Automation",
        duration: "Weeks 1-4",
        topics: [
          "Linux Operating System fundamentals, distributions (Ubuntu, RHEL)",
          "Filesystem navigation, permissions (chmod, chown), links & environment variables",
          "Bash Shell Scripting for automated tasks, cron jobs & process management",
          "Package management (apt/yum), SSH keys, networking utilities (curl, netstat)"
        ]
      },
      {
        module: "Module 2: Version Control with Git & GitHub in VS Code",
        duration: "Weeks 5-7",
        topics: [
          "Git CLI fundamentals: git init, add, commit, branch, checkout, merge",
          "Remote collaboration with GitHub: push, pull, pull requests, code reviews",
          "Resolving merge conflicts and using VS Code Git extensions & diff viewer",
          "Git branching models (GitFlow, trunk-based development)"
        ]
      },
      {
        module: "Module 3: Amazon Web Services (AWS) Core Cloud Architecture",
        duration: "Weeks 8-13",
        topics: [
          "AWS Global Infrastructure: Regions, Availability Zones & Edge Locations",
          "Compute: EC2 instances, AMIs, Auto Scaling Groups & Elastic Load Balancers",
          "Storage: AWS S3 storage tiers, bucket policies, lifecycle rules & EBS volumes",
          "Networking: Virtual Private Cloud (VPC), Subnets, Internet Gateways, Route Tables, NAT",
          "Security & Identity: IAM users, groups, roles, policies & MFA",
          "Databases & Monitoring: AWS RDS (MySQL/PostgreSQL) & CloudWatch logs/alarms"
        ]
      },
      {
        module: "Module 4: Containerization with Docker & Kubernetes (Basics)",
        duration: "Weeks 14-18",
        topics: [
          "Containerization vs Virtualization: Why Docker is essential",
          "Writing optimized Dockerfiles in VS Code, multi-stage builds & image tagging",
          "Docker Compose for multi-container local applications",
          "Kubernetes Basics: Architecture, Master vs Worker nodes, kubectl CLI",
          "Deploying basic Pods, Deployments, ReplicaSets & ClusterIP / NodePort Services"
        ]
      },
      {
        module: "Module 5: DevOps CI/CD Automation & Capstone Project",
        duration: "Weeks 19-22",
        topics: [
          "Continuous Integration & Continuous Deployment (CI/CD) concepts",
          "Automated pipelines using GitHub Actions: build, test, and deploy to AWS",
          "Deploying a containerized web application on AWS EC2 with Docker",
          "Live Capstone: Highly Available Multi-Tier Web Application deployed on AWS via CI/CD"
        ]
      }
    ],
    projects: [
      "Fault-Tolerant Auto-Scaling Multi-AZ Web Application on AWS VPC",
      "Multi-Container Microservice Application Dockerized and Orchestrated with Docker Compose",
      "Automated GitHub Actions CI/CD Pipeline deploying to AWS Cloud with Zero Downtime"
    ]
  },
  {
    id: "python-sql-foundations",
    title: "Python Programming & SQL Databases Foundation Course",
    category: "programming-db",
    badge: "Great for Beginners",
    duration: "2.5 Months (10 Weeks)",
    mode: "100% Live Interactive Virtual",
    batchType: "Weekday & Weekend Batches",
    rating: 4.91,
    reviewsCount: 890,
    shortDesc: "The core foundational programming course. Master Python Programming, SQL / Databases, Git & GitHub, Jupyter Notebook, and VS Code from scratch.",
    overview: "The essential starting point for any tech career. Whether your dream is Data Science, AI, Web Development, or Cloud Engineering, this course ensures your coding logic, object-oriented concepts, and relational database mastery are rock-solid.",
    admissionStatus: "Admissions Open",
    batchSchedule: "Weekday & Weekend Batches",
    placementSupport: "Dedicated Placement Drives",
    nextBatch: "Starts Upcoming Monday",
    hirers: ["TCS", "Cognizant", "Wipro", "Tech Mahindra", "Mindtree", "Capgemini"],
    tools: [
      "Python Programming",
      "SQL / Databases",
      "Git & GitHub",
      "VS Code",
      "Jupyter Notebook"
    ],
    careerRoles: [
      "Junior Python Developer",
      "Database Developer / SQL Specialist",
      "Junior Data Engineer",
      "Backend Associate"
    ],
    curriculum: [
      {
        module: "Module 1: Python Programming Core & Logic Building",
        duration: "Weeks 1-4",
        topics: [
          "Variables, Data Types, Type Casting, Operators & Conditional logic",
          "Loops (for, while), List comprehensions & Pattern programming",
          "Functions, Arguments, Return values, Lambda functions & Scopes",
          "Working with VS Code IDE and Jupyter Notebook"
        ]
      },
      {
        module: "Module 2: Advanced Python & Object-Oriented Programming (OOP)",
        duration: "Weeks 5-7",
        topics: [
          "Object-Oriented Programming: Classes, Objects, __init__, self",
          "Inheritance, Polymorphism, Encapsulation & Data Abstraction",
          "Exception Handling (try-except-finally) & Custom Exceptions",
          "File Handling (txt, csv, json) & Regular Expressions (Regex)",
          "Version Control with Git & GitHub in VS Code"
        ]
      },
      {
        module: "Module 3: SQL & Relational Databases Mastery",
        duration: "Weeks 8-10",
        topics: [
          "Database Design, Primary Keys, Foreign Keys, Normalization (1NF, 2NF, 3NF)",
          "Writing CRUD operations: INSERT, UPDATE, DELETE, SELECT",
          "Joining tables (INNER, LEFT, RIGHT), GROUP BY & Aggregate functions",
          "Connecting Python to SQL Databases using psycopg2 / sqlite3",
          "Capstone Project: Full Database-Backed Inventory & Student Record Management App"
        ]
      }
    ],
    projects: [
      "Database-Backed Banking Account Management System in Python & SQL",
      "Automated Web Scraper and Database Ingestion Tool built with Python",
      "E-Commerce Inventory & Order Tracking SQL Relational Database"
    ]
  },
  {
    id: "complete-ai-cloud-diploma",
    title: "Executive Integrated Diploma in AI, Data Science & Cloud DevOps",
    category: "flagship",
    badge: "All-in-One Flagship Track",
    duration: "8 Months (32 Weeks)",
    mode: "100% Live Interactive Virtual",
    batchType: "Weekday & Weekend Batches",
    rating: 4.98,
    reviewsCount: 820,
    shortDesc: "The complete, all-inclusive career track covering ALL 17 in-demand skills from Advanced Excel & SQL to Python, ML, Deep Learning, AWS, Docker, Kubernetes & DevOps.",
    overview: "Our premier comprehensive program designed for students and working professionals aiming for top-tier tech roles. Covers the entire pipeline: from data analytics and business intelligence, to machine learning, artificial intelligence, deep learning, and cloud infrastructure on AWS with DevOps automation.",
    admissionStatus: "Admissions Open",
    batchSchedule: "Weekday & Weekend Batches",
    placementSupport: "Dedicated Placement Drives",
    nextBatch: "Starts 20th Oct 2026",
    hirers: ["Amazon", "Microsoft", "Google", "Flipkart", "Razorpay", "Swiggy", "Deloitte"],
    tools: [
      "Data Analytics",
      "Data Science",
      "Artificial Intelligence (AI)",
      "Machine Learning (ML)",
      "Deep Learning",
      "Cloud Computing",
      "DevOps",
      "Python Programming",
      "SQL / Databases",
      "Excel (Advanced)",
      "Power BI / Tableau",
      "Git & GitHub",
      "Linux Basics",
      "Docker & Kubernetes (Basics)",
      "AWS",
      "Jupyter Notebook",
      "VS Code"
    ],
    careerRoles: [
      "Full-Stack AI & Data Engineer",
      "Senior Data Scientist / ML Specialist",
      "Cloud & MLOps Engineer",
      "Principal Technical Consultant"
    ],
    curriculum: [
      {
        module: "Phase 1: Foundations (Python, Advanced Excel & SQL Databases)",
        duration: "Weeks 1-8",
        topics: [
          "Python Programming, OOPs & Algorithm design in VS Code",
          "Advanced Excel with Power Query & Financial/Operational Dashboards",
          "SQL Relational Databases, Window Functions & Query Optimization",
          "Git & GitHub version control best practices"
        ]
      },
      {
        module: "Phase 2: Analytics & Visual Storytelling (Power BI, Tableau)",
        duration: "Weeks 9-14",
        topics: [
          "Interactive dashboard creation in Power BI with DAX calculations",
          "Visual storytelling & Level of Detail (LOD) formulas in Tableau",
          "NumPy & Pandas for automated data cleaning in Jupyter Notebooks"
        ]
      },
      {
        module: "Phase 3: Data Science & Machine Learning (ML)",
        duration: "Weeks 15-22",
        topics: [
          "Statistics, Hypothesis Testing & Feature Engineering",
          "Classical Machine Learning: Regression, Classification, Clustering, Ensembles (XGBoost)",
          "Building reproducible ML pipelines in Scikit-Learn"
        ]
      },
      {
        module: "Phase 4: Artificial Intelligence (AI) & Deep Learning",
        duration: "Weeks 23-28",
        topics: [
          "Neural Networks, PyTorch, Backpropagation & Optimizers",
          "Computer Vision (CNNs) & Natural Language Processing (Transformers)",
          "Generative AI fundamentals & Prompt Engineering"
        ]
      },
      {
        module: "Phase 5: Cloud Computing (AWS) & DevOps Automation",
        duration: "Weeks 29-32",
        topics: [
          "Linux system administration basics & Bash scripting",
          "AWS Cloud Infrastructure: EC2, S3, RDS, IAM & VPC networking",
          "Docker containerization & basic Kubernetes orchestration",
          "CI/CD pipelines deploying live AI models to AWS"
        ]
      }
    ],
    projects: [
      "Enterprise Multi-Tenant AI Prediction Platform deployed on AWS Cloud",
      "Real-Time E-Commerce Analytics Engine with SQL, Power BI & Machine Learning",
      "Automated CI/CD MLOps Pipeline with Docker & GitHub Actions on AWS"
    ]
  },
  {
    id: "sap-s4-hana-finance",
    title: "SAP S/4HANA Finance (FI/CO) Consultant Program",
    category: "sap-erp",
    badge: "Enterprise Finance Choice",
    duration: "2 Months (8 Weeks)",
    mode: "100% Live Interactive Virtual",
    batchType: "Weekday & Weekend Batches",
    rating: 4.95,
    reviewsCount: 1180,
    shortDesc: "Master SAP S/4HANA Financial Accounting (FI), Universal Journal (ACDOCA), General Ledger, AP/AR, Asset Accounting, Controlling (CO), and SAP Fiori Launchpad in 2 intensive months.",
    overview: "Fast-track 2-month live virtual program designed for Commerce graduates, CAs, ICWAs, MBAs, and ERP professionals in India. Gain practical hands-on mastery over the SAP S/4HANA Finance suite: enterprise structure configuration, real-time General Ledger, Accounts Payable, Accounts Receivable, New Asset Accounting, and Cost Center Controlling with dedicated SAP GUI and Fiori server access.",
    admissionStatus: "Admissions Open",
    batchSchedule: "Weekday & Weekend Batches",
    placementSupport: "Dedicated Placement Drives",
    nextBatch: "Starts This Saturday & Wednesday",
    hirers: ["Accenture", "TCS SAP Practice", "Deloitte India", "Wipro", "IBM", "Infosys", "Capgemini"],
    tools: [
      "SAP S/4HANA Finance",
      "SAP Fiori",
      "General Ledger (G/L)",
      "Accounts Payable (AP)",
      "Accounts Receivable (AR)",
      "Asset Accounting",
      "Controlling (CO)",
      "Universal Journal (ACDOCA)"
    ],
    careerRoles: [
      "SAP FICO Consultant",
      "SAP S/4HANA Finance Analyst",
      "ERP Financial Consultant",
      "Financial Systems Specialist"
    ],
    curriculum: [
      {
        module: "Module 1: S/4HANA Architecture, Enterprise Structure & Fiori Launchpad",
        duration: "Weeks 1-2",
        topics: [
          "SAP S/4HANA vs ECC architecture, in-memory computing benefits",
          "Enterprise Structure: Company, Company Code, Business Area, Functional Area",
          "Fiscal Year Variants (K4, V3 Indian April-March), Posting Period Variants",
          "Modern SAP Fiori Launchpad navigation, role-based tiles, and standard SAP GUI"
        ]
      },
      {
        module: "Module 2: General Ledger Accounting & Universal Journal (ACDOCA)",
        duration: "Weeks 2-3",
        topics: [
          "Chart of Accounts (Operational, Country-specific, Group)",
          "G/L Account Master records and reconciliation accounts",
          "Universal Journal (Table ACDOCA) - Single Source of Truth for FI & CO",
          "Document Splitting configuration (Passive, Active, Zero-Balance)",
          "Posting keys, document types, tolerance groups, and parked documents"
        ]
      },
      {
        module: "Module 3: Accounts Payable (AP) & Vendor Accounting",
        duration: "Weeks 4-5",
        topics: [
          "Vendor Master / Business Partner (BP) approach in S/4HANA",
          "Vendor invoice posting, debit memos, down payment requests & clearing",
          "Automatic Payment Program (APP - TCode F110) configuration & execution",
          "Indian Tax deduction at source (TDS / Withholding Tax) configuration"
        ]
      },
      {
        module: "Module 4: Accounts Receivable (AR) & Customer Accounting",
        duration: "Weeks 5-6",
        topics: [
          "Customer Business Partner configuration and account groups",
          "Customer invoice processing, incoming payments, and partial/residual clearings",
          "Credit Management basics in S/4HANA (FSCM Integration)",
          "Dunning program configuration for overdue customer reminders"
        ]
      },
      {
        module: "Module 5: New Asset Accounting (FI-AA) & Period-End Financial Closing",
        duration: "Weeks 6-7",
        topics: [
          "New Asset Accounting architecture in S/4HANA & Ledger approach",
          "Asset Classes, Chart of Depreciation, Depreciation Keys & Methods",
          "Asset acquisition, retirements, transfers, and monthly depreciation run (AFAB)",
          "Period-End Closing cockpit, financial statement versions (FSV), Balance Sheet & P&L"
        ]
      },
      {
        module: "Module 6: Controlling (CO) & Cross-Module Integration with MM",
        duration: "Weeks 7-8",
        topics: [
          "Controlling Area setup, Cost Elements as G/L accounts in S/4HANA",
          "Cost Center Accounting, Profit Center Accounting & Internal Orders",
          "Cross-module integration: FI-MM Automatic Account Determination (OBYC)",
          "Real-time Procure-to-Pay (P2P) financial posting flow and GR/IR reconciliation"
        ]
      }
    ],
    projects: []
  },
  {
    id: "sap-s4-hana-mm",
    title: "SAP S/4HANA Materials Management (MM) Sourcing & Procurement",
    category: "sap-erp",
    badge: "Supply Chain & Procurement",
    duration: "2 Months (8 Weeks)",
    mode: "100% Live Interactive Virtual",
    batchType: "Weekday & Weekend Batches",
    rating: 4.94,
    reviewsCount: 1050,
    shortDesc: "Master SAP S/4HANA Materials Management (MM), Sourcing & Procurement, Procure-to-Pay (P2P), Material Master, Inventory Management, MIRO, and FI integration in 2 intensive months.",
    overview: "Fast-track 2-month live virtual bootcamp designed for supply chain, logistics, engineering, and commerce aspirants in India. Master the complete Procure-to-Pay (P2P) lifecycle in SAP S/4HANA: configure purchasing organizations, manage Material Masters, vendor Business Partners, RFQ, Purchase Orders, Goods Receipt (MIGO), Logistics Invoice Verification (MIRO), and automatic account determination with Finance (FI).",
    admissionStatus: "Admissions Open",
    batchSchedule: "Weekday & Weekend Batches",
    placementSupport: "Dedicated Placement Drives",
    nextBatch: "Starts Upcoming Monday & Weekend",
    hirers: ["L&T Infotech", "Tata Steel", "TCS", "Accenture", "Cognizant", "Reliance Industries", "Infosys"],
    tools: [
      "SAP S/4HANA Material Management (MM)",
      "Procure-to-Pay (P2P)",
      "Inventory Management",
      "Material Master",
      "Purchasing",
      "Invoice Verification (MIRO)",
      "SAP Fiori",
      "FI-MM Integration"
    ],
    careerRoles: [
      "SAP MM Consultant",
      "SAP Sourcing & Procurement Specialist",
      "Supply Chain ERP Consultant",
      "SAP Procurement Lead"
    ],
    curriculum: [
      {
        module: "Module 1: Enterprise Structure in MM & Business Partner Configuration",
        duration: "Weeks 1-2",
        topics: [
          "Enterprise Structure in S/4HANA: Plants, Storage Locations, Purchasing Organizations",
          "Assignment of Plant to Company Code and Purchasing Org to Plant",
          "Business Partner (BP) Approach in S/4HANA for Suppliers & Vendors",
          "SAP Fiori Sourcing & Procurement Apps overview"
        ]
      },
      {
        module: "Module 2: Master Data in S/4HANA Materials Management",
        duration: "Weeks 2-3",
        topics: [
          "Material Master Views (Basic, Purchasing, MRP, Plant Data, Accounting)",
          "Material Types (ROH, HALB, FERT) and Number Range configuration",
          "Purchasing Info Records (PIR) and Source Lists",
          "Quota Arrangements and Vendor Evaluation parameters"
        ]
      },
      {
        module: "Module 3: Sourcing & Purchasing Operations (PR to PO)",
        duration: "Weeks 4-5",
        topics: [
          "Purchase Requisition (PR) creation and release strategies with classification",
          "Request for Quotation (RFQ), Quotation Maintenance & Price Comparison",
          "Purchase Order (PO) creation, document types, item categories & limits",
          "Outline Agreements: Contracts (Value & Quantity) and Scheduling Agreements"
        ]
      },
      {
        module: "Module 4: Inventory Management & Physical Inventory (MIGO)",
        duration: "Weeks 5-6",
        topics: [
          "Goods Receipt (MIGO) against Purchase Orders and Production Orders",
          "Movement Types (101, 103, 122, 201, 261, 301, 311)",
          "Stock Transfers: Plant-to-Plant and Storage Location to Storage Location",
          "Special Stocks: Subcontracting, Consignment, and Pipeline procurement",
          "Physical Inventory Process: Document creation, count entry, and difference posting"
        ]
      },
      {
        module: "Module 5: Logistics Invoice Verification (MIRO) & GR/IR Clearance",
        duration: "Weeks 6-7",
        topics: [
          "Logistics Invoice Verification (MIRO) and Three-Way Matching (PO, GR, Invoice)",
          "Tolerances, Price Variance, Quantity Variance & Invoice Blocking",
          "Credit Memos, Subsequent Debits, Subsequent Credits",
          "GR/IR Clearing Account maintenance and reconciliation"
        ]
      },
      {
        module: "Module 6: Valuation, Account Determination (OBYC) & Integration with FI",
        duration: "Weeks 7-8",
        topics: [
          "Material Valuation: Moving Average Price (V) vs Standard Price (S)",
          "Valuation Class, Account Category Reference, Valuation Area",
          "Automatic Account Determination (Transaction OBYC) setup",
          "Integration touchpoints between SAP MM and SAP S/4HANA Finance"
        ]
      }
    ],
    projects: []
  },
  {
    id: "sap-s4-hana-integrated",
    title: "SAP S/4HANA Integrated ERP: Finance (FI) & Material Management (MM)",
    category: "sap-erp",
    badge: "Dual Functional Specialization",
    duration: "4 Months (16 Weeks)",
    mode: "100% Live Interactive Virtual",
    batchType: "Weekday & Weekend Batches",
    rating: 4.98,
    reviewsCount: 890,
    shortDesc: "The comprehensive 4-month dual functional mastertrack combining SAP S/4HANA Finance (FI/CO) and Materials Management (MM) for complete enterprise ERP mastery.",
    overview: "Cross-functional SAP functional consultants command top consulting roles in enterprise IT firms (Deloitte, PwC, Accenture, TCS). In this comprehensive 4-month track, master both SAP S/4HANA Finance and SAP Materials Management, giving you end-to-end mastery over procurement, inventory, supplier settlements, and financial balance sheets.",
    admissionStatus: "Admissions Open",
    batchSchedule: "Weekday & Weekend Batches",
    placementSupport: "Dedicated Placement Drives",
    nextBatch: "Starts This Monday & Saturday",
    hirers: ["Deloitte", "PwC", "Accenture", "EY", "TCS", "Wipro", "Capgemini", "LTIMindtree"],
    tools: [
      "SAP S/4HANA Finance",
      "SAP S/4HANA Material Management (MM)",
      "SAP Fiori",
      "General Ledger",
      "Procure-to-Pay (P2P)",
      "Inventory Management",
      "Invoice Verification (MIRO)",
      "Automatic Account Determination"
    ],
    careerRoles: [
      "SAP Cross-Functional Consultant (FI/MM)",
      "Principal ERP Consultant",
      "SAP Techno-Functional Lead",
      "Senior SAP Solution Architect"
    ],
    curriculum: [
      {
        module: "Phase 1: Enterprise Architecture & Universal Master Data",
        duration: "Weeks 1-3",
        topics: [
          "Enterprise Structure in S/4HANA (Company Code, Plants, Purchasing Orgs)",
          "Business Partner (BP) architecture for Financial and Procurement roles",
          "SAP Fiori Launchpad setup and personalization"
        ]
      },
      {
        module: "Phase 2: S/4HANA Financial Accounting Core (General Ledger, AP, AR)",
        duration: "Weeks 4-6",
        topics: [
          "Universal Journal (ACDOCA), Document Splitting & G/L Accounting",
          "Accounts Payable & Indian Withholding Tax (TDS) automation",
          "Accounts Receivable, Billing Integration & Incoming Payments"
        ]
      },
      {
        module: "Phase 3: S/4HANA Materials Management Core (Purchasing & Master Data)",
        duration: "Weeks 7-9",
        topics: [
          "Material Master, Purchasing Info Records & Source Lists",
          "Purchase Requisitions, RFQ evaluation & Purchase Orders",
          "Contracts and Scheduling Agreements in S/4HANA"
        ]
      },
      {
        module: "Phase 4: Inventory Management & Three-Way Matching (MIGO & MIRO)",
        duration: "Weeks 10-12",
        topics: [
          "Goods Receipt (MIGO), Stock Transfers & Movement Types",
          "Logistics Invoice Verification (MIRO) & Three-Way Matching",
          "Discrepancy resolution, debit/credit memos, and invoice blocking"
        ]
      },
      {
        module: "Phase 5: Deep Cross-Module Integration: Automatic Account Determination (OBYC)",
        duration: "Weeks 13-14",
        topics: [
          "OBYC mapping: Valuation Classes, Account Modifiers, and G/L accounts",
          "GR/IR Clearing Account reconciliation workflows",
          "Month-end financial impact of inventory movements"
        ]
      },
      {
        module: "Phase 6: Asset Accounting, Controlling & Enterprise Audit Simulation",
        duration: "Weeks 15-16",
        topics: [
          "New Asset Accounting & Cost Center Accounting (CO)",
          "Financial Statement Versions (FSV) & Executive Dashboard in SAP Fiori",
          "Comprehensive Financial & Material Sourcing Audit Simulation in SAP Fiori"
        ]
      }
    ],
    projects: []
  }
];

// 3. 100% Live Virtual Learning Ecosystem Features
const VIRTUAL_LEARNING_PILLARS = [
  {
    icon: "🎥",
    title: "Live 2-Way Interactive Classes",
    badge: "100% Live Online",
    desc: "Not boring pre-recorded videos. Attend interactive live sessions with two-way audio, video, real-time code walkthroughs, and screen sharing with mentors."
  },
  {
    icon: "⏱️",
    title: "Flexible Batch Timings (IST)",
    badge: "Morning & Evening",
    desc: "Designed for working professionals and students: Early Morning Batches (7:00 AM - 9:00 AM IST), Late Evening (7:30 PM - 9:30 PM IST), or Weekend-only."
  },
  {
    icon: "☁️",
    title: "Cloud Sandboxes & Virtual Lab",
    badge: "Zero Setup Required",
    desc: "Access browser-based pre-configured cloud environments for Python, AWS, Jupyter Notebooks, Docker, and SQL without needing high-end laptop hardware."
  },
  {
    icon: "⚡",
    title: "1-on-1 Instant Doubt Support",
    badge: "15-Min Turnaround",
    desc: "Dedicated Teaching Assistants (TAs) available for 1-on-1 video screen-share debugging breakout rooms and dedicated WhatsApp doubt resolution channels."
  },
  {
    icon: "📼",
    title: "LMS Lifetime Recording Access",
    badge: "Unlimited Replays",
    desc: "Missed a session? Every live class is recorded in 1080p HD. Get lifetime access to class recordings, notes, cheat sheets, and GitHub code repositories."
  },
  {
    icon: "🎯",
    title: "Pan-India Virtual Placement Drives",
    badge: "Direct Referrals",
    desc: "Remote interview opportunities, video mock technical interviews, resume building, and direct corporate interview calls with 350+ recruiting partners."
  }
];

// 3b. Free Add-on Benefits You'll Gain (ACTE Style High-Value Pack)
const FREE_ADDON_BENEFITS = [
  {
    title: "Free Soft Skills & Aptitude Grooming",
    value: "Included Free",
    tag: "100% INCLUDED",
    desc: "Corporate communication, group discussions, email etiquette, and behavioral interview coaching to clear HR rounds with confidence."
  },
  {
    title: "Unlimited Mock Technical Interviews",
    value: "Included Free",
    tag: "100% INCLUDED",
    desc: "Simulated 1-on-1 technical coding rounds conducted by Principal Engineers and Staff Tech Leads from Tier-1 MNCs."
  },
  {
    title: "Lifetime LMS Access with 1080p Recordings",
    value: "Included Free",
    tag: "100% INCLUDED",
    desc: "Permanent unlimited access to high-definition video archives, lecture decks, code scripts, and future batch refresher access."
  },
  {
    title: "ATS Resume & LinkedIn Optimization",
    value: "Included Free",
    tag: "100% INCLUDED",
    desc: "Expert tech recruiters re-engineer your CV with high-impact keyword metrics that pass ATS scans and attract recruiters on LinkedIn."
  },
  {
    title: "10+ GitHub Capstone Portfolios",
    value: "Included Free",
    tag: "100% INCLUDED",
    desc: "Build verified production-grade repositories deployed to AWS and cloud servers with clean README documentation."
  },
  {
    title: "Dedicated WhatsApp Doubt Community",
    value: "Included Free",
    tag: "100% INCLUDED",
    desc: "Direct 24/7 access to mentor-monitored WhatsApp doubt rooms for instant code debugging and homework guidance."
  }
];

// 3c. Modes of Virtual Training
const TRAINING_MODES = [
  {
    title: "Live Interactive Virtual Batches",
    timing: "Weekday Morning (7:00 - 9:00 AM) & Evening (7:30 - 9:30 PM IST)",
    audience: "Fresh graduates, students, and early career professionals",
    features: ["Daily live interactive sessions", "Live coding alongside mentor", "Daily coding assignments & code review"],
    badge: "Most Popular"
  },
  {
    title: "Weekend Intensive Virtual Batches",
    timing: "Saturday & Sunday (10:00 AM - 2:00 PM or 2:30 PM - 6:30 PM IST)",
    audience: "Working professionals aiming for a promotion or domain switch",
    features: ["Intensive live weekend sessions", "Mid-week recorded doubt clinics", "Flexible project submission deadlines"],
    badge: "Working Professionals"
  },
  {
    title: "1-on-1 Fast-Track Mentorship",
    timing: "Personalized Schedule & Custom Paced",
    audience: "Learners seeking rapid career transitions or bespoke projects",
    features: ["Dedicated Lead Architect mentor", "Customized curriculum focus", "Fast-track completion in 45-60 days"],
    badge: "Fast-Track"
  },
  {
    title: "Corporate & Team Upskilling",
    timing: "Custom Cohort Schedules (IST / US / UK timezones)",
    audience: "Enterprise engineering teams and corporate groups",
    features: ["Custom tailored technology stack", "Hands-on cloud capstone sprints", "Executive progress tracking reports"],
    badge: "Enterprise"
  }
];

// 4. Testimonials (Virtual Alumni)
const TESTIMONIALS = [
  {
    name: "Karthik Subramanian",
    role: "Data Scientist at Fractal Analytics",
    previous: "Mechanical Engg Graduate (Fresher)",
    package: "₹14.5 LPA",
    batchMode: "Live Virtual Batch (Alumnus)",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    quote: "Attending the live interactive virtual batch from my home saved me months of commute time. Mastering Python, SQL, Jupyter Notebooks, and Machine Learning algorithms gave me the exact skills needed to clear Fractal's coding and technical rounds."
  },
  {
    name: "Pooja Deshmukh",
    role: "AI & Deep Learning Engineer at Swiggy",
    previous: "B.Sc Mathematics Graduate",
    package: "₹13.5 LPA",
    batchMode: "Live Virtual Batch (Alumnus)",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    quote: "The hands-on Deep Learning and Computer Vision curriculum in PyTorch was outstanding. The instructor was live every day to review our code, and cloud lab access made building real models seamless."
  },
  {
    name: "Rahul Verma",
    role: "DevOps & Cloud Engineer at Capgemini",
    previous: "Non-tech Support Executive (₹2.8 LPA)",
    package: "₹10.2 LPA (265% Hike)",
    batchMode: "Live Virtual Batch (Alumnus)",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    quote: "Switching from support to DevOps was the best decision. The flexible evening virtual batch suited my work schedule perfectly. Learning Linux, Git, AWS, and Docker/Kubernetes gave me real enterprise skills."
  },
  {
    name: "Sneha Reddy",
    role: "BI & Data Analyst at Deloitte India",
    previous: "B.Com Graduate (Non-Technical)",
    package: "₹8.8 LPA",
    batchMode: "Live Virtual Batch (Alumnus)",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    quote: "Coming from a commerce background, I was intimidated by tech. ThinkToSkill's live virtual interactive sessions in Advanced Excel, SQL, and Power BI / Tableau made me thoroughly confident. Cracked Deloitte within 3 weeks!"
  }
];

// 5. Frequently Asked Questions
const FAQS = [
  {
    q: "Do I need prior coding experience to learn Python, Data Science or Data Analytics?",
    a: "No prior coding experience is required! Our programs start from the foundational basics: logic building, Python programming syntax, Linux basics, and SQL fundamentals before advancing to Machine Learning, AI, or Cloud topics."
  },
  {
    q: "How do the 100% Live Virtual interactive classes work?",
    a: "Classes are conducted live over our interactive virtual portal with two-way audio/video, instructor live screen-sharing, and interactive coding. You can ask doubts in real-time, share your screen for error resolution, and access 1080p recordings on the LMS anytime."
  },
  {
    q: "How does the Placement Assistant program work for online students?",
    a: "Our dedicated Placement Assistant conducts extensive resume re-engineering, GitHub project profiling, and multi-tier mock technical interviews in Python, SQL, ML, and Cloud topics. We provide continuous interview drives with our 350+ corporate hiring partners until you secure your offer letter."
  },
  {
    q: "Are flexible payment options and milestones available?",
    a: "Yes! You can choose our convenient 2-part milestone payment schedule or inquire about scholarship opportunities directly with our academic counselors during your consultation."
  },
  {
    q: "Will I get practical access to tools like AWS, Docker, Power BI, and Jupyter Notebooks?",
    a: "Yes! Every student gets hands-on cloud lab environments and guided project setups in VS Code, Jupyter Notebooks, AWS cloud compute sandboxes, and Power BI/Tableau desktop software."
  },
  {
    q: "Do you provide live SAP S/4HANA GUI & Fiori server access for Finance and Material Management?",
    a: "Yes! All students enrolled in SAP S/4HANA Finance and SAP S/4HANA Materials Management (MM) get dedicated 24/7 remote SAP S/4HANA server access with both standard SAP GUI and modern SAP Fiori Launchpad for practical end-to-end enterprise configurations."
  },
  {
    q: "Can I discuss my career background and get guidance before enrolling?",
    a: "Yes! You can connect 1-on-1 with our Senior Academic Advisors to review your educational background, select the best tech track for your career goals, and explore the complete curriculum syllabus before confirming your registration."
  }
];
