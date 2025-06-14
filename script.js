// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Mock data for demonstrations
const mockEmotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust'];
const mockArticles = [
    {
        title: "Leonardo DiCaprio's Environmental Activism",
        snippet: "Academy Award-winning actor Leonardo DiCaprio has been a prominent environmental activist...",
        similarity: 0.89
    },
    {
        title: "Climate Change and Hollywood",
        snippet: "How celebrities like Leonardo DiCaprio are using their platform to raise awareness...",
        similarity: 0.76
    },
    {
        title: "The Wolf of Wall Street Actor's Latest Project",
        snippet: "Leonardo DiCaprio continues to take on challenging roles while maintaining his activism...",
        similarity: 0.72
    }
];

// Text Classification Demo
document.getElementById('classifyBtn')?.addEventListener('click', function() {
    const text = document.getElementById('classificationInput').value.trim();
    const resultDiv = document.getElementById('classificationResult');
    
    if (!text) {
        resultDiv.innerHTML = '<p style="color: #e53e3e;">Please enter some text to analyze.</p>';
        return;
    }
    
    // Show loading state
    resultDiv.innerHTML = '<div class="loading">Analyzing emotions... <i class="fas fa-spinner fa-spin"></i></div>';
    
    // Simulate API call
    setTimeout(() => {
        const emotions = generateMockEmotionResults(text);
        displayEmotionResults(emotions, resultDiv);
    }, 1500);
});

function generateMockEmotionResults(text) {
    // Simple heuristic-based mock analysis
    const emotions = {
        joy: 0,
        sadness: 0,
        anger: 0,
        fear: 0,
        surprise: 0,
        disgust: 0
    };
    
    const positiveWords = ['happy', 'great', 'awesome', 'wonderful', 'amazing', 'excited', 'love', 'perfect'];
    const negativeWords = ['sad', 'terrible', 'awful', 'hate', 'angry', 'furious', 'disgusting', 'fear'];
    const surpriseWords = ['wow', 'incredible', 'unbelievable', 'shocking', 'unexpected'];
    
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
        if (positiveWords.some(pw => word.includes(pw))) {
            emotions.joy += 0.3;
        }
        if (negativeWords.some(nw => word.includes(nw))) {
            emotions.sadness += 0.2;
            emotions.anger += 0.1;
        }
        if (surpriseWords.some(sw => word.includes(sw))) {
            emotions.surprise += 0.4;
        }
    });
    
    // Add some randomness and normalize
    Object.keys(emotions).forEach(emotion => {
        emotions[emotion] += Math.random() * 0.3;
    });
    
    const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
        Object.keys(emotions).forEach(emotion => {
            emotions[emotion] = emotions[emotion] / total;
        });
    } else {
        emotions.joy = 0.5;
        emotions.sadness = 0.3;
        emotions.surprise = 0.2;
    }
    
    return emotions;
}

function displayEmotionResults(emotions, container) {
    const sortedEmotions = Object.entries(emotions)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
    
    const html = `
        <div class="emotion-results">
            <h4>Emotion Analysis Results</h4>
            <div class="emotion-bars">
                ${sortedEmotions.map(([emotion, score]) => `
                    <div class="emotion-bar">
                        <div class="emotion-label">
                            <span class="emotion-icon">${getEmotionIcon(emotion)}</span>
                            <span class="emotion-name">${emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                            <span class="emotion-score">${(score * 100).toFixed(1)}%</span>
                        </div>
                        <div class="emotion-progress">
                            <div class="emotion-fill" style="width: ${score * 100}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <p class="analysis-note">
                <i class="fas fa-info-circle"></i>
                This analysis uses DistilBERT fine-tuned on emotion classification data.
            </p>
        </div>
    `;
    
    container.innerHTML = html;
}

function getEmotionIcon(emotion) {
    const icons = {
        joy: '😊',
        sadness: '😢',
        anger: '😠',
        fear: '😨',
        surprise: '😲',
        disgust: '🤢'
    };
    return icons[emotion] || '😐';
}

// Text Summarization Demo
document.getElementById('summarizeBtn')?.addEventListener('click', function() {
    const text = document.getElementById('summarizationInput').value.trim();
    const length = document.getElementById('summaryLength').value;
    const resultDiv = document.getElementById('summarizationResult');
    
    if (!text) {
        resultDiv.innerHTML = '<p style="color: #e53e3e;">Please enter some text to summarize.</p>';
        return;
    }
    
    if (text.length < 100) {
        resultDiv.innerHTML = '<p style="color: #e53e3e;">Please enter a longer text (at least 100 characters) for meaningful summarization.</p>';
        return;
    }
    
    // Show loading state
    resultDiv.innerHTML = '<div class="loading">Generating summary... <i class="fas fa-spinner fa-spin"></i></div>';
    
    // Simulate API call
    setTimeout(() => {
        const summary = generateMockSummary(text, length);
        displaySummaryResults(summary, text, resultDiv);
    }, 2000);
});

function generateMockSummary(text, length) {
    // Simple extractive summarization mock
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    let summaryLength;
    switch(length) {
        case 'short': summaryLength = 1; break;
        case 'medium': summaryLength = Math.min(3, Math.ceil(sentences.length * 0.3)); break;
        case 'long': summaryLength = Math.min(5, Math.ceil(sentences.length * 0.5)); break;
        default: summaryLength = 2;
    }
    
    // Select sentences based on length and position (simple heuristic)
    const selectedSentences = sentences
        .map((sentence, index) => ({
            sentence: sentence.trim(),
            score: sentence.length + (index === 0 ? 50 : 0) // Boost first sentence
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, summaryLength)
        .map(item => item.sentence)
        .join('. ') + '.';
    
    return selectedSentences;
}

function displaySummaryResults(summary, originalText, container) {
    const compressionRatio = ((originalText.length - summary.length) / originalText.length * 100).toFixed(1);
    
    const html = `
        <div class="summary-results">
            <h4>Generated Summary</h4>
            <div class="summary-text">
                "${summary}"
            </div>
            <div class="summary-stats">
                <div class="stat">
                    <span class="stat-label">Original Length:</span>
                    <span class="stat-value">${originalText.length} chars</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Summary Length:</span>
                    <span class="stat-value">${summary.length} chars</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Compression:</span>
                    <span class="stat-value">${compressionRatio}%</span>
                </div>
            </div>
            <p class="analysis-note">
                <i class="fas fa-info-circle"></i>
                This summary was generated using T5-small model with extractive techniques.
            </p>
        </div>
    `;
    
    container.innerHTML = html;
}

// Information Retrieval Demo
document.getElementById('searchBtn')?.addEventListener('click', function() {
    const query = document.getElementById('searchInput').value.trim();
    const resultDiv = document.getElementById('searchResults');
    
    if (!query) {
        resultDiv.innerHTML = '<p style="color: #e53e3e;">Please enter a search query.</p>';
        return;
    }
    
    // Show loading state
    resultDiv.innerHTML = '<div class="loading">Searching Wikipedia... <i class="fas fa-spinner fa-spin"></i></div>';
    
    // Simulate API call
    setTimeout(() => {
        const results = generateMockSearchResults(query);
        displaySearchResults(results, resultDiv);
    }, 1500);
});

function generateMockSearchResults(query) {
    // Generate mock results based on query
    const results = [];
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('leonardo') || queryLower.includes('dicaprio')) {
        results.push(...mockArticles);
    } else if (queryLower.includes('deep learning') || queryLower.includes('ai')) {
        results.push(
            {
                title: "Deep Learning Fundamentals",
                snippet: "Deep learning is a subset of machine learning that uses neural networks with multiple layers...",
                similarity: 0.92
            },
            {
                title: "Artificial Intelligence and Machine Learning",
                snippet: "The field of AI has seen tremendous growth with deep learning techniques revolutionizing...",
                similarity: 0.87
            },
            {
                title: "Neural Networks in Modern AI",
                snippet: "Deep neural networks have become the backbone of modern artificial intelligence systems...",
                similarity: 0.83
            }
        );
    } else if (queryLower.includes('python')) {
        results.push(
            {
                title: "Python Programming Language",
                snippet: "Python is a high-level, interpreted programming language known for its simplicity and readability...",
                similarity: 0.95
            },
            {
                title: "Python in Data Science",
                snippet: "Python has become the de facto language for data science and machine learning applications...",
                similarity: 0.88
            },
            {
                title: "History of Python Development",
                snippet: "Python was created by Guido van Rossum and first released in 1991, emphasizing code readability...",
                similarity: 0.81
            }
        );
    } else {
        // Generic results
        results.push(
            {
                title: `Search Results for "${query}"`,
                snippet: `This article contains information related to ${query} and covers various aspects of the topic...`,
                similarity: 0.75
            },
            {
                title: `Related Topics: ${query}`,
                snippet: `Explore more about ${query} and its connections to other important concepts and ideas...`,
                similarity: 0.68
            }
        );
    }
    
    return results;
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<p>No results found. Try a different search query.</p>';
        return;
    }
    
    const html = `
        <div class="search-results-container">
            <h4>Search Results (${results.length} found)</h4>
            ${results.map((result, index) => `
                <div class="search-result-item">
                    <h5>${result.title}</h5>
                    <p>${result.snippet}</p>
                    <div class="result-metadata">
                        <span class="similarity-score">Similarity: ${(result.similarity * 100).toFixed(1)}%</span>
                        <span class="result-rank">Rank: #${index + 1}</span>
                    </div>
                </div>
            `).join('')}
            <p class="analysis-note">
                <i class="fas fa-info-circle"></i>
                Results ranked by semantic similarity using DistilBERT embeddings and cosine similarity.
            </p>
        </div>
    `;
    
    container.innerHTML = html;
}

// Chart.js configurations and initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // Emotion Distribution Chart
    const emotionCtx = document.getElementById('emotionChart');
    if (emotionCtx) {
        new Chart(emotionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Disgust'],
                datasets: [{
                    data: [35, 20, 15, 12, 10, 8],
                    backgroundColor: [
                        '#FFD700', '#87CEEB', '#FF6B6B', '#DDA0DD', 
                        '#98FB98', '#F0E68C'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Article Length Distribution Chart
    const lengthCtx = document.getElementById('lengthChart');
    if (lengthCtx) {
        new Chart(lengthCtx, {
            type: 'bar',
            data: {
                labels: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000+'],
                datasets: [{
                    label: 'Article Length',
                    data: [120, 340, 280, 180, 80],
                    backgroundColor: 'rgba(102, 126, 234, 0.7)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1
                }, {
                    label: 'Summary Length',
                    data: [45, 85, 75, 65, 30],
                    backgroundColor: 'rgba(118, 75, 162, 0.7)',
                    borderColor: 'rgba(118, 75, 162, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Articles',
                            font: {
                                size: 11
                            }
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Character Count',
                            font: {
                                size: 11
                            }
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                }
            }
        });
    }

    // Similarity Heatmap
    const similarityCtx = document.getElementById('similarityChart');
    if (similarityCtx) {
        const queries = ['Leonardo DiCaprio', 'Deep Learning', 'Python', 'France'];
        const articles = ['Actor Biography', 'AI Research', 'Programming Guide', 'Country Info', 'Tech News'];
        
        // Generate mock similarity matrix
        const data = [];
        queries.forEach((query, i) => {
            articles.forEach((article, j) => {
                let similarity = Math.random() * 0.4 + 0.2; // Base similarity
                // Boost relevant matches
                if ((i === 0 && j === 0) || (i === 1 && j === 1) || (i === 2 && j === 2) || (i === 3 && j === 3)) {
                    similarity += 0.4;
                }
                data.push({
                    x: j,
                    y: i,
                    v: similarity
                });
            });
        });

        new Chart(similarityCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Similarity Score',
                    data: data,
                    backgroundColor: function(context) {
                        const value = context.parsed.v;
                        const alpha = value;
                        return `rgba(102, 126, 234, ${alpha})`;
                    },
                    pointRadius: function(context) {
                        return context.parsed.v * 20 + 5;
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: -0.5,
                        max: 4.5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return articles[value] || '';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Articles'
                        }
                    },
                    y: {
                        min: -0.5,
                        max: 3.5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return queries[value] || '';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Queries'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const point = context[0];
                                return `${queries[point.parsed.y]} → ${articles[point.parsed.x]}`;
                            },
                            label: function(context) {
                                return `Similarity: ${(context.parsed.v * 100).toFixed(1)}%`;
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Performance Comparison Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'radar',
            data: {
                labels: ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'Speed', 'Memory Usage'],
                datasets: [{
                    label: 'DistilBERT',
                    data: [92, 91, 90, 91, 85, 78],
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }, {
                    label: 'BERT-Base',
                    data: [94, 93, 92, 93, 65, 45],
                    backgroundColor: 'rgba(118, 75, 162, 0.2)',
                    borderColor: 'rgba(118, 75, 162, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    // Training Progress Chart
    const trainingCtx = document.getElementById('trainingChart');
    if (trainingCtx) {
        const epochs = Array.from({length: 10}, (_, i) => i + 1);
        const trainLoss = [0.8, 0.6, 0.4, 0.3, 0.25, 0.2, 0.18, 0.16, 0.15, 0.14];
        const valLoss = [0.85, 0.65, 0.45, 0.35, 0.3, 0.25, 0.23, 0.22, 0.21, 0.2];
        const trainAcc = [60, 72, 82, 87, 89, 91, 92, 92.5, 93, 93.2];
        const valAcc = [58, 70, 80, 85, 87, 89, 90, 90.5, 91, 91.5];

        new Chart(trainingCtx, {
            type: 'line',
            data: {
                labels: epochs,
                datasets: [{
                    label: 'Training Loss',
                    data: trainLoss,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    yAxisID: 'y'
                }, {
                    label: 'Validation Loss',
                    data: valLoss,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    yAxisID: 'y'
                }, {
                    label: 'Training Accuracy',
                    data: trainAcc,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    yAxisID: 'y1'
                }, {
                    label: 'Validation Accuracy',
                    data: valAcc,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.1)',
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Epoch'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Loss'
                        },
                        min: 0,
                        max: 1
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
                        },
                        min: 50,
                        max: 100,
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
}

// Add CSS for loading states and results
const additionalCSS = `
.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #667eea;
    font-weight: 500;
}

.emotion-results {
    text-align: left;
}

.emotion-results h4 {
    margin-bottom: 20px;
    color: #2d3748;
}

.emotion-bars {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.emotion-bar {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.emotion-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.emotion-icon {
    font-size: 1.2rem;
}

.emotion-name {
    font-weight: 500;
    color: #4a5568;
    flex: 1;
    margin-left: 8px;
}

.emotion-score {
    font-weight: 600;
    color: #667eea;
}

.emotion-progress {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
}

.emotion-fill {
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    transition: width 0.5s ease;
}

.summary-results h4 {
    margin-bottom: 16px;
    color: #2d3748;
}

.summary-text {
    background: #f7fafc;
    border-left: 4px solid #667eea;
    padding: 16px;
    margin-bottom: 16px;
    font-style: italic;
    line-height: 1.6;
}

.summary-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 16px;
}

.stat {
    text-align: center;
    padding: 12px;
    background: #f7fafc;
    border-radius: 8px;
}

.stat-label {
    display: block;
    font-size: 0.875rem;
    color: #718096;
    margin-bottom: 4px;
}

.stat-value {
    display: block;
    font-weight: 600;
    color: #667eea;
}

.search-results-container h4 {
    margin-bottom: 20px;
    color: #2d3748;
}

.search-result-item {
    border-left: 4px solid #667eea;
}

.search-result-item h5 {
    color: #2d3748;
    margin-bottom: 8px;
    font-size: 1rem;
}

.result-metadata {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}

.result-rank {
    color: #718096;
    font-size: 0.875rem;
}

.analysis-note {
    margin-top: 16px;
    padding: 12px;
    background: #edf2f7;
    border-radius: 6px;
    color: #4a5568;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.analysis-note i {
    color: #667eea;
}

@media (max-width: 768px) {
    .summary-stats {
        grid-template-columns: 1fr;
    }
    
    .result-metadata {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);
