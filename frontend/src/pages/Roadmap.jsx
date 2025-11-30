import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Lesson content data for each topic
const lessonContent = {
  // Programming Fundamentals
  "Choose a Programming Language (Python/Java/C++)": {
    definition: "Selecting the right programming language is crucial for your learning journey. Python is great for beginners and data science, Java for enterprise applications, and C++ for system programming and performance-critical applications.",
    codeSnippet: `// Python example
def hello_world():
    print("Hello, World!")
    
# Java example
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// C++ example
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    resources: [
      "Python: https://www.python.org/",
      "Java: https://www.oracle.com/java/",
      "C++: https://isocpp.org/"
    ]
  },
  "Basic Syntax and Data Types": {
    definition: "Syntax refers to the rules that define the structure of a programming language. Data types specify what kind of value a variable can hold, such as numbers, text, or boolean values.",
    codeSnippet: `// Python
name = "Alice"  # String
age = 25        # Integer
height = 5.8    # Float
is_student = True  # Boolean

// Java
String name = "Alice";
int age = 25;
double height = 5.8;
boolean isStudent = true;

// C++
string name = "Alice";
int age = 25;
double height = 5.8;
bool isStudent = true;`,
    resources: [
      "Python Data Types: https://docs.python.org/3/library/datatypes.html",
      "Java Data Types: https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html",
      "C++ Data Types: https://en.cppreference.com/w/cpp/language/types"
    ]
  },
  "Variables and Operators": {
    definition: "Variables are containers for storing data values. Operators are symbols that perform operations on variables and values, such as arithmetic, comparison, and logical operations.",
    codeSnippet: `// Python
x = 10
y = 5
sum = x + y      # Addition
diff = x - y     # Subtraction
product = x * y  # Multiplication
quotient = x / y # Division

// Java
int x = 10;
int y = 5;
int sum = x + y;
int diff = x - y;
int product = x * y;
int quotient = x / y;

// C++
int x = 10;
int y = 5;
int sum = x + y;
int diff = x - y;
int product = x * y;
int quotient = x / y;`,
    resources: [
      "Python Operators: https://docs.python.org/3/library/operator.html",
      "Java Operators: https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html",
      "C++ Operators: https://en.cppreference.com/w/cpp/language/operators"
    ]
  },
  "Control Structures (if-else, loops)": {
    definition: "Control structures determine the flow of execution in a program. Conditional statements (if-else) execute code based on conditions, while loops (for, while) repeat code blocks.",
    codeSnippet: `// Python
age = 18
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# For loop
for i in range(5):
    print(i)

# While loop
count = 0
while count < 5:
    print(count)
    count += 1

// Java
int age = 18;
if (age >= 18) {
    System.out.println("You are an adult");
} else {
    System.out.println("You are a minor");
}

// For loop
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// While loop
int count = 0;
while (count < 5) {
    System.out.println(count);
    count++;
}

// C++
int age = 18;
if (age >= 18) {
    cout << "You are an adult" << endl;
} else {
    cout << "You are a minor" << endl;
}

// For loop
for (int i = 0; i < 5; i++) {
    cout << i << endl;
}

// While loop
int count = 0;
while (count < 5) {
    cout << count << endl;
    count++;
}`,
    resources: [
      "Python Control Flow: https://docs.python.org/3/tutorial/controlflow.html",
      "Java Control Flow: https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html",
      "C++ Control Flow: https://en.cppreference.com/w/cpp/language/control"
    ]
  },
  "Functions and Methods": {
    definition: "Functions are blocks of code designed to perform a particular task. They provide modularity and code reusability. Methods are functions that belong to objects in object-oriented programming.",
    codeSnippet: `// Python
def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)

// Java
public class Greeter {
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
    
    public static void main(String[] args) {
        String message = greet("Alice");
        System.out.println(message);
    }
}

// C++
#include <iostream>
#include <string>
using namespace std;

string greet(string name) {
    return "Hello, " + name + "!";
}

int main() {
    string message = greet("Alice");
    cout << message << endl;
    return 0;
}`,
    resources: [
      "Python Functions: https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
      "Java Methods: https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html",
      "C++ Functions: https://en.cppreference.com/w/cpp/language/functions"
    ]
  },
  "Basic I/O Operations": {
    definition: "Input/Output operations allow programs to interact with users and external data. Input involves reading data, while output involves displaying or writing data.",
    codeSnippet: `// Python
name = input("Enter your name: ")
print(f"Hello, {name}!")

# Reading from file
with open("data.txt", "r") as file:
    content = file.read()

# Writing to file
with open("output.txt", "w") as file:
    file.write("Hello, World!")

// Java
import java.util.Scanner;
import java.io.*;

Scanner scanner = new Scanner(System.in);
System.out.print("Enter your name: ");
String name = scanner.nextLine();
System.out.println("Hello, " + name + "!");

// Reading from file
try {
    BufferedReader reader = new BufferedReader(new FileReader("data.txt"));
    String content = reader.readLine();
    reader.close();
} catch (IOException e) {
    e.printStackTrace();
}

// C++
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

string name;
cout << "Enter your name: ";
getline(cin, name);
cout << "Hello, " << name << "!" << endl;

// Reading from file
ifstream file("data.txt");
string content;
getline(file, content);
file.close();

// Writing to file
ofstream outFile("output.txt");
outFile << "Hello, World!";
outFile.close();`,
    resources: [
      "Python I/O: https://docs.python.org/3/tutorial/inputoutput.html",
      "Java I/O: https://docs.oracle.com/javase/tutorial/essential/io/",
      "C++ I/O: https://en.cppreference.com/w/cpp/io"
    ]
  },
  "Debugging Techniques": {
    definition: "Debugging is the process of finding and fixing errors or bugs in code. Techniques include using print statements, debuggers, and systematic problem-solving approaches.",
    codeSnippet: `// Python - Using print statements
def calculate_average(numbers):
    print(f"Input: {numbers}")  # Debug print
    total = sum(numbers)
    print(f"Total: {total}")    # Debug print
    count = len(numbers)
    print(f"Count: {count}")    # Debug print
    average = total / count
    print(f"Average: {average}") # Debug print
    return average

# Using debugger (Python)
import pdb; pdb.set_trace()

// Java - Using print statements
public class Calculator {
    public static double calculateAverage(int[] numbers) {
        System.out.println("Input: " + Arrays.toString(numbers));
        int total = 0;
        for (int num : numbers) {
            total += num;
        }
        System.out.println("Total: " + total);
        int count = numbers.length;
        System.out.println("Count: " + count);
        double average = (double) total / count;
        System.out.println("Average: " + average);
        return average;
    }
}

// C++ - Using print statements
#include <iostream>
#include <vector>
using namespace std;

double calculateAverage(vector<int> numbers) {
    cout << "Input size: " << numbers.size() << endl;
    int total = 0;
    for (int num : numbers) {
        total += num;
    }
    cout << "Total: " << total << endl;
    int count = numbers.size();
    cout << "Count: " << count << endl;
    double average = (double) total / count;
    cout << "Average: " << average << endl;
    return average;
}`,
    resources: [
      "Python Debugging: https://docs.python.org/3/library/pdb.html",
      "Java Debugging: https://docs.oracle.com/javase/8/docs/technotes/guides/jpda/",
      "C++ Debugging: https://en.cppreference.com/w/cpp/debug"
    ]
  }
};

const Roadmap = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchAllDomains();
  }, []);

  const fetchAllDomains = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/roadmap/topics');
      if (response.data.success && response.data.topics) {
        setDomains(response.data.topics);
      }
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
    setLoading(false);
  };

  const fetchRoadmap = async (domainTitle) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/roadmap/${encodeURIComponent(domainTitle)}`);
      if (response.data.success && response.data.roadmap) {
        setRoadmap(response.data.roadmap);
        setSelectedDomain(domainTitle);
        setCurrentStepIndex(0); // Reset to first step when loading new roadmap
        
        // Initialize completed steps from step progress data
        if (response.data.roadmap.stepProgress) {
          const completed = response.data.roadmap.stepProgress
            .filter(step => step.completed)
            .map(step => step.step_index);
          setCompletedSteps(completed);
        } else {
          setCompletedSteps([]);
        }
      } else {
        setRoadmap(null);
      }
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      setRoadmap(null);
    }
    setLoading(false);
  };

  const updateStepProgress = async (topic, stepIndex, stepDescription, completed) => {
    try {
      const response = await axios.post('/api/roadmap/step-progress', {
        topic,
        stepIndex,
        stepDescription,
        completed
      });
      return response.data;
    } catch (error) {
      // Handle 404 error by falling back to topic-level progress
      if (error.response && error.response.status === 404) {
        console.warn('Step progress endpoint not found, falling back to topic progress');
        // Fallback to topic-level progress update
        const progressPercentage = roadmap ? Math.round(((completedSteps.length + (completed ? 1 : -1)) / roadmap.steps.length) * 100) : 0;
        const isCompleted = roadmap ? (completedSteps.length + (completed ? 1 : -1)) === roadmap.steps.length : false;
        return await updateTopicProgress(topic, progressPercentage, isCompleted);
      }
      console.error('Error updating step progress:', error);
      throw error;
    }
  };

  const updateTopicProgress = async (topic, progress, completed) => {
    try {
      const response = await axios.post('/api/roadmap/progress', {
        topic,
        progress,
        completed
      });
      return response.data;
    } catch (error) {
      console.error('Error updating topic progress:', error);
      throw error;
    }
  };

  const toggleStepCompletion = async (stepIndex, stepDescription) => {
    const isCurrentlyCompleted = completedSteps.includes(stepIndex);
    const newCompletedSteps = isCurrentlyCompleted
      ? completedSteps.filter(index => index !== stepIndex)
      : [...completedSteps, stepIndex];
    
    setCompletedSteps(newCompletedSteps);
    
    // Update step progress in database
    if (roadmap && roadmap.title) {
      try {
        await updateStepProgress(roadmap.title, stepIndex, stepDescription, !isCurrentlyCompleted);
        
        // Update overall topic progress
        if (roadmap.steps) {
          const progressPercentage = Math.round((newCompletedSteps.length / roadmap.steps.length) * 100);
          const isCompleted = newCompletedSteps.length === roadmap.steps.length;
          
          await updateTopicProgress(roadmap.title, progressPercentage, isCompleted);
          
          // Refresh domains to update progress bars
          await fetchAllDomains();
        }
      } catch (error) {
        console.error('Failed to update progress:', error);
        // Revert the UI change if the API call fails
        setCompletedSteps(isCurrentlyCompleted 
          ? [...completedSteps, stepIndex] 
          : completedSteps.filter(index => index !== stepIndex)
        );
      }
    }
  };

  const handleMarkAsDone = async () => {
    if (roadmap && roadmap.steps && currentStepIndex < roadmap.steps.length) {
      const stepDescription = roadmap.steps[currentStepIndex];
      await toggleStepCompletion(currentStepIndex, stepDescription);
    }
  };

  const handleNextTopic = () => {
    if (roadmap && roadmap.steps && currentStepIndex < roadmap.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePreviousTopic = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const getDomainIcon = (domain) => {
    const domainIcons = {
      "Programming Fundamentals": "bi-code-slash",
      "Quantitative Aptitude": "bi-calculator",
      "Logical Reasoning": "bi-puzzle",
      "Frontend Development": "bi-window",
      "Backend Development": "bi-server",
      "Full Stack Development": "bi-stack",
      "Data Structures": "bi-diagram-3",
      "Algorithms": "bi-brain",
      "System Design": "bi-layout-wtf",
      "Database Management Systems": "bi-database",
      "DevOps Practices": "bi-tools",
      "Machine Learning Basics": "bi-robot",
      "Cybersecurity Fundamentals": "bi-shield-lock",
      "Blockchain Technology": "bi-link",
      "Mobile Development": "bi-phone",
      "UI/UX Design": "bi-palette",
      "Cloud Computing": "bi-cloud",
      "Game Development": "bi-controller",
      "Data Science": "bi-bar-chart",
      "Technical Interview Preparation": "bi-person-workspace",
      "Resume Building": "bi-file-earmark-person",
      "HR Interview Preparation": "bi-chat-square-quote",
      "Mock Interviews": "bi-people",
      "Soft Skills Development": "bi-person-hearts",
      "Verbal Ability": "bi-chat-text",
      "Web Security": "bi-shield-shaded",
      "Object-Oriented Programming": "bi-bricks",
      "Operating Systems": "bi-gear-wide-connected",
      "Computer Networks": "bi-hdd-network",
      "Software Engineering": "bi-code",
      "Competitive Programming": "bi-trophy",
      "IoT Development": "bi-device-hdd",
      "Quality Assurance": "bi-check2-circle",
      "Project Management": "bi-kanban",
      "Technical Writing": "bi-pencil",
      "Open Source Contribution": "bi-github",
      "Entrepreneurship in Tech": "bi-lightbulb",
      "Research and Development": "bi-search",
      "Ethical Hacking": "bi-incognito",
      "Digital Marketing for Tech": "bi-megaphone",
      "AR/VR Development": "bi-goggles",
      "Quantum Computing": "bi-atom",
      "Bioinformatics": "bi-dna",
      "FinTech Development": "bi-currency-dollar",
      "Edge Computing": "bi-router",
      "Natural Language Processing": "bi-translate",
      "Computer Vision": "bi-eye",
      "Robotics Programming": "bi-android2",
      "Embedded Systems": "bi-cpu",
      "High Performance Computing": "bi-speedometer2"
    };
    return domainIcons[domain] || "bi-map";
  };

  const getDomainColor = (domainCategory) => {
    const categoryColors = {
      "core-cs": "primary",
      "web-dev": "success",
      "aptitude": "info",
      "interview": "warning",
      "advanced": "danger",
      "specialized": "secondary"
    };
    return categoryColors[domainCategory] || "secondary";
  };

  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      "core-cs": "Core Computer Science",
      "web-dev": "Web Development",
      "aptitude": "Aptitude & Soft Skills",
      "interview": "Interview Preparation",
      "advanced": "Advanced Topics",
      "specialized": "Specialized Domains"
    };
    return categoryNames[category] || category;
  };

  const groupDomainsByCategory = (domains) => {
    const grouped = {};
    domains.forEach(domain => {
      if (!grouped[domain.category]) {
        grouped[domain.category] = [];
      }
      grouped[domain.category].push(domain);
    });
    return grouped;
  };

  const groupedDomains = groupDomainsByCategory(domains);

  if (loading && !selectedDomain) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Role-Based Roadmaps Header */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0 text-center">
                <i className="bi bi-compass me-2"></i>
                ROLE BASED ROADMAPS
              </h3>
            </div>
          </div>
        </div>
      </div>

      {!selectedDomain ? (
        // Show all domains when no domain is selected
        <div className="row">
          <div className="col-12">
            {Object.keys(groupedDomains).map(category => (
              <div key={category} className="mb-5">
                <h4 className="text-uppercase text-primary mb-4 pb-2 border-bottom">
                  {getCategoryDisplayName(category)}
                </h4>
                <div className="row">
                  {groupedDomains[category].map(domain => (
                    <div key={domain.id} className="col-lg-4 col-md-6 mb-4">
                      <div 
                        className="card h-100 shadow-sm border-0 cursor-pointer hover-shadow"
                        onClick={() => fetchRoadmap(domain.title)}
                        style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
                        }}
                      >
                        <div className="card-body d-flex flex-column">
                          <div className="text-center mb-3">
                            <div className={`rounded-circle bg-${getDomainColor(domain.category)} text-white d-inline-flex align-items-center justify-content-center`} 
                                 style={{ width: '70px', height: '70px' }}>
                              <i className={`bi ${getDomainIcon(domain.title)} fs-3`}></i>
                            </div>
                          </div>
                          <h5 className="card-title text-center">{domain.title}</h5>
                          <p className="card-text text-muted text-center flex-grow-1">
                            {domain.description}
                          </p>
                          
                          {/* Progress bar for each domain */}
                          <div className="mt-2">
                            <div className="d-flex justify-content-between mb-1">
                              <small className="text-muted">Progress</small>
                              <small className="text-muted">
                                {domain.userProgress !== undefined ? `${Math.round(domain.userProgress)}%` : '0%'}
                              </small>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div 
                                className={`progress-bar bg-${getDomainColor(domain.category)}`}
                                style={{ width: `${domain.userProgress !== undefined ? domain.userProgress : 0}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="text-center mt-3">
                            <button 
                              className={`btn btn-${getDomainColor(domain.category)}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                fetchRoadmap(domain.title);
                              }}
                            >
                              View Roadmap
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Show roadmap details when a domain is selected
        <div className="row">
          <div className="col-12">
            <div className="mb-3">
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  setSelectedDomain(null);
                  setRoadmap(null);
                  setCompletedSteps([]);
                  setCurrentStepIndex(0);
                }}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Back to All Roadmaps
              </button>
            </div>
            
            {loading ? (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading roadmap for {selectedDomain}...</p>
                </div>
              </div>
            ) : roadmap ? (
              <div className="card shadow-sm">
                <div className={`card-header bg-${getDomainColor(roadmap.category)} text-white`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-1">
                        <i className={`${getDomainIcon(roadmap.title)} me-2`}></i>
                        {roadmap.title}
                      </h4>
                      <p className="mb-0 opacity-75">{roadmap.description}</p>
                    </div>
                    <div className="text-end">
                      <div className="badge bg-light text-dark fs-6">
                        {completedSteps.length}/{roadmap.steps ? roadmap.steps.length : 0} Completed
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="roadmap-progress mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Overall Progress</span>
                      <span className="fw-semibold">
                        {roadmap.steps ? 
                          Math.round((completedSteps.length / roadmap.steps.length) * 100) : 0
                        }%
                      </span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{ 
                          width: `${roadmap.steps ? 
                            (completedSteps.length / roadmap.steps.length) * 100 : 0
                          }%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Current Step Display */}
                  {roadmap.steps && roadmap.steps.length > 0 && currentStepIndex < roadmap.steps.length && (
                    <div className="roadmap-step mb-4">
                      <div className="d-flex">
                        <div className="step-number me-3">
                          <div 
                            className={`rounded-circle d-flex align-items-center justify-content-center ${
                              completedSteps.includes(currentStepIndex) 
                                ? 'bg-success text-white' 
                                : 'bg-light text-dark border'
                            }`}
                            style={{ 
                              width: '50px', 
                              height: '50px', 
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => toggleStepCompletion(currentStepIndex, roadmap.steps[currentStepIndex])}
                            title={completedSteps.includes(currentStepIndex) ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {completedSteps.includes(currentStepIndex) ? (
                              <i className="bi bi-check-lg fs-5"></i>
                            ) : (
                              <span className="fw-bold">{currentStepIndex + 1}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="step-content flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="mb-1">{roadmap.steps[currentStepIndex]}</h5>
                            <span className={`badge ${
                              completedSteps.includes(currentStepIndex) 
                                ? 'bg-success' 
                                : 'bg-secondary'
                            }`}>
                              {completedSteps.includes(currentStepIndex) ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                          
                          <div className="progress mb-2" style={{ height: '6px' }}>
                            <div 
                              className={`progress-bar ${
                                completedSteps.includes(currentStepIndex) 
                                  ? 'bg-success' 
                                  : 'bg-warning'
                              }`} 
                              style={{ width: completedSteps.includes(currentStepIndex) ? '100%' : '0%' }}
                            ></div>
                          </div>
                          
                          <div className="step-actions mt-2">
                            <small className="text-muted">
                              {completedSteps.includes(currentStepIndex) ? (
                                <span className="text-success">
                                  <i className="bi bi-check-circle me-1"></i>
                                  Completed
                                </span>
                              ) : (
                                'Click the circle to mark as complete'
                              )}
                            </small>
                          </div>
                          
                          {/* Lesson Content */}
                          <div className="lesson-content mt-4 p-3 bg-light rounded">
                            <h6>Lesson: {roadmap.steps[currentStepIndex]}</h6>
                            {lessonContent[roadmap.steps[currentStepIndex]] ? (
                              <>
                                <div className="mb-3">
                                  <h6>Definition:</h6>
                                  <p>{lessonContent[roadmap.steps[currentStepIndex]].definition}</p>
                                </div>
                                
                                <div className="mb-3">
                                  <h6>Code Example:</h6>
                                  <pre className="bg-dark text-white p-3 rounded">
                                    <code>{lessonContent[roadmap.steps[currentStepIndex]].codeSnippet}</code>
                                  </pre>
                                </div>
                                
                                <div>
                                  <h6>Additional Resources:</h6>
                                  <ul>
                                    {lessonContent[roadmap.steps[currentStepIndex]].resources.map((resource, index) => (
                                      <li key={index}>
                                        <a href={resource.split(': ')[1]} target="_blank" rel="noopener noreferrer">
                                          {resource.split(': ')[0]}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            ) : (
                              <p>
                                Detailed lesson content for "{roadmap.steps[currentStepIndex]}" will be available soon.
                                This section will include comprehensive explanations, practical examples, and hands-on exercises.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Navigation and Action Buttons */}
                      <div className="d-flex justify-content-between mt-4">
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={handlePreviousTopic}
                          disabled={currentStepIndex === 0}
                        >
                          <i className="bi bi-arrow-left me-1"></i>
                          Previous Topic
                        </button>
                        
                        <div>
                          <button 
                            className={`btn ${completedSteps.includes(currentStepIndex) ? 'btn-success' : 'btn-primary'} me-2`}
                            onClick={handleMarkAsDone}
                          >
                            <i className={`bi ${completedSteps.includes(currentStepIndex) ? 'bi-check-circle' : 'bi-check'} me-1`}></i>
                            {completedSteps.includes(currentStepIndex) ? 'Completed' : 'Mark as Done'}
                          </button>
                          
                          <button 
                            className="btn btn-primary"
                            onClick={handleNextTopic}
                            disabled={currentStepIndex === roadmap.steps.length - 1}
                          >
                            Next Topic
                            <i className="bi bi-arrow-right ms-1"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">
                            <i className="bi bi-clock-history me-2"></i>
                            Estimated Time
                          </h6>
                          <p className="card-text">{roadmap.estimated_time || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Priority
                          </h6>
                          <p className="card-text">
                            <span className={`badge bg-${
                              roadmap.priority === 'high' ? 'danger' : 
                              roadmap.priority === 'medium' ? 'warning' : 'secondary'
                            }`}>
                              {roadmap.priority || 'Not specified'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {roadmap.resources && roadmap.resources.length > 0 && (
                    <div className="mt-4">
                      <h6>
                        <i className="bi bi-book me-2"></i>
                        Recommended Resources
                      </h6>
                      <ul className="list-group">
                        {roadmap.resources.map((resource, index) => (
                          <li key={index} className="list-group-item">
                            <i className="bi bi-link me-2"></i>
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="card-footer bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Last updated: {roadmap.created_at ? new Date(roadmap.created_at).toLocaleDateString() : 'Recently'}
                    </small>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => fetchRoadmap(selectedDomain)}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <i className="bi bi-map display-1 text-muted"></i>
                  <h4 className="mt-3">Roadmap Not Available</h4>
                  <p className="text-muted mb-4">
                    We couldn't find a roadmap for {selectedDomain}. Please try another domain or check back later.
                  </p>
                  <button className="btn btn-primary" onClick={() => fetchRoadmap(selectedDomain)}>
                    <i className="bi bi-arrow-repeat me-2"></i>
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;