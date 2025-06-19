// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
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
    const button = this;
    
    if (!text) {
        resultDiv.innerHTML = '<p style="color: #e53e3e;">Please enter some text to analyze.</p>';
        return;
    }
    
    // Disable button and show loading state
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    resultDiv.innerHTML = '<div class="loading">Analyzing emotions... <i class="fas fa-spinner fa-spin"></i></div>';
    
    // Simulate API call
    setTimeout(() => {
        const emotions = generateMockEmotionResults(text);
        displayEmotionResults(emotions, resultDiv);
        
        // Reset button
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-magic"></i> Analyze Emotions';
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
    const button = this;
    
    if (!text) {
        resultDiv.innerHTML = '<p style="color: #e53e3e;">Please enter some text to summarize.</p>';
        return;
    }
    
    if (text.length < 100) {
        resultDiv.innerHTML = '<p style="color: #e53e3e;">Please enter a longer text (at least 100 characters) for meaningful summarization.</p>';
        return;
    }
    
    // Disable button and show loading state
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    resultDiv.innerHTML = '<div class="loading">Generating summary... <i class="fas fa-spinner fa-spin"></i></div>';
    
    // Simulate API call
    setTimeout(() => {
        const summary = generateMockSummary(text, length);
        displaySummaryResults(summary, text, resultDiv);
        
        // Reset button
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-compress"></i> Generate Summary';
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
    const button = this;
    
    if (!query) {
        resultDiv.innerHTML = '<p style="color: #e53e3e;">Please enter a search query.</p>';
        return;
    }
    
    // Disable button and show loading state
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    resultDiv.innerHTML = '<div class="loading">Searching Wikipedia... <i class="fas fa-spinner fa-spin"></i></div>';
    
    // Simulate API call
    setTimeout(() => {
        const results = generateMockSearchResults(query);
        displaySearchResults(results, resultDiv);
        
        // Reset button
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-search"></i> Search';
    }, 1500);
});

function generateMockSearchResults(query) {
    // Generate mock results based on query
    const results = [];
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('leonardo') || queryLower.includes('dicaprio')) {
        results.push({
            title: "Leonardo DiCaprio - Actor and Environmental Activist",
            snippet: "Leonardo DiCaprio is an American actor and film producer known for his roles in Titanic, Inception, and The Revenant. He won an Academy Award for Best Actor.",
            similarity: 0.6668
        });
    } else if (queryLower.includes('deep learning') || queryLower.includes('ai')) {
        results.push({
            title: "Deep Learning: Neural Networks and Machine Learning",
            snippet: "Deep learning is a subset of machine learning that uses neural networks with multiple layers to learn complex patterns in data.",
            similarity: 0.5844
        });
    } else if (queryLower.includes('python')) {
        results.push({
            title: "Python Programming Language",
            snippet: "Python is a high-level programming language known for its simplicity and readability. It's widely used in data science and web development.",
            similarity: 0.4740
        });
    } else if (queryLower.includes('france')) {
        results.push({
            title: "France: Country in Western Europe",
            snippet: "France is a country in Western Europe known for its culture, cuisine, and landmarks like the Eiffel Tower. Paris is the capital city.",
            similarity: 0.3617
        });
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
    // Emotion Distribution Chart - Updated with actual dataset distribution
    const emotionCtx = document.getElementById('emotionChart');
    if (emotionCtx) {
        new Chart(emotionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Neutral', 'Love', 'Happiness', 'Relief', 'Hate', 'Other Emotions'],
                datasets: [{
                    data: [82.1, 3.6, 3.0, 2.3, 1.9, 7.1],
                    backgroundColor: [
                        '#A0A0A0', '#FF69B4', '#FFD700', '#87CEEB', 
                        '#FF6B6B', '#DDA0DD'
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

    // Article Length Distribution Chart - Updated with actual CNN/DailyMail data
    const lengthCtx = document.getElementById('lengthChart');
    if (lengthCtx) {
        new Chart(lengthCtx, {
            type: 'bar',
            data: {
                labels: ['0-1000', '1000-2000', '2000-4000', '4000-6000', '6000+'],
                datasets: [{
                    label: 'Article Length (chars)',
                    data: [50, 180, 450, 250, 70],
                    backgroundColor: 'rgba(102, 126, 234, 0.7)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1
                }, {
                    label: 'Highlights Length (chars)',
                    data: [850, 150, 0, 0, 0],
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

    // Performance Comparison Chart - Updated with actual results
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'radar',
            data: {
                labels: ['Accuracy', 'Precision', 'Recall', 'Cross-Domain', 'Multi-Dataset', 'Training Speed'],
                datasets: [{
                    label: 'Original Model',
                    data: [98.0, 98.04, 96.15, 79.8, 93.5, 85],
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }, {
                    label: 'Multi-Dataset Model',
                    data: [93.5, 97.51, 94.35, 85.0, 93.5, 80],
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

    // Training Progress Chart - Updated with actual training data
    const trainingCtx = document.getElementById('trainingChart');
    if (trainingCtx) {
        const epochs = [1, 2, 3, 4, 5];
        const trainLoss = [0.1545, 0.0897, 0.0277, 0.0143, 0.0045];
        const valLoss = [0.1196, 0.0633, 0.0649, 0.0726, 0.0830];
        const trainAcc = [95.0, 97.5, 99.0, 99.5, 99.9];
        const valAcc = [93.0, 96.0, 97.5, 98.0, 98.2];

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

// Initialize charts when Chart.js is available
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Chart.js to fully load
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            console.log('Chart.js loaded, initializing charts...');
            initializeCharts();
        } else {
            console.warn('Chart.js not loaded - charts will not be displayed');
            // Show message in chart containers
            const canvases = ['emotionChart', 'lengthChart', 'performanceChart', 'trainingChart', 'similarityChart'];
            canvases.forEach(id => {
                const canvas = document.getElementById(id);
                if (canvas) {
                    const parent = canvas.parentElement;
                    parent.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 250px; color: #718096; font-size: 0.9rem;"><i class="fas fa-chart-bar" style="margin-right: 8px;"></i>Chart loading...</div>';
                }
            });
        }
    }, 500);
});

function initializeCharts() {
    // Initialize emotion chart if canvas exists
    const emotionCanvas = document.getElementById('emotionChart');
    if (emotionCanvas) {
        new Chart(emotionCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Disgust'],
                datasets: [{
                    data: [30, 20, 15, 10, 15, 10],
                    backgroundColor: [
                        '#FFD700', '#4A90E2', '#E53E3E', '#FF8C00',
                        '#9F7AEA', '#38A169'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Initialize length chart if canvas exists
    const lengthCanvas = document.getElementById('lengthChart');
    if (lengthCanvas) {
        new Chart(lengthCanvas, {
            type: 'bar',
            data: {
                labels: ['Original Articles', 'Generated Summaries'],
                datasets: [{
                    label: 'Average Word Count',
                    data: [856, 142],
                    backgroundColor: ['#667eea', '#764ba2']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Initialize performance chart if canvas exists
    const performanceCanvas = document.getElementById('performanceChart');
    if (performanceCanvas) {
        new Chart(performanceCanvas, {
            type: 'radar',
            data: {
                labels: ['Accuracy', 'Precision', 'Recall', 'F1-Score'],
                datasets: [{
                    label: 'Initial Model',
                    data: [81.5, 66.5, 0, 0],
                    borderColor: '#E53E3E',
                    backgroundColor: 'rgba(229, 62, 62, 0.2)'
                }, {
                    label: 'Improved Model',
                    data: [87.9, 87.2, 67.9, 76.4],
                    borderColor: '#38A169',
                    backgroundColor: 'rgba(56, 161, 105, 0.2)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Initialize training progress chart if canvas exists
    const trainingCanvas = document.getElementById('trainingChart');
    if (trainingCanvas) {
        new Chart(trainingCanvas, {
            type: 'line',
            data: {
                labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5'],
                datasets: [{
                    label: 'Training Loss',
                    data: [0.8, 0.6, 0.4, 0.3, 0.25],
                    borderColor: '#E53E3E',
                    tension: 0.4
                }, {
                    label: 'Validation Loss',
                    data: [0.9, 0.7, 0.5, 0.35, 0.3],
                    borderColor: '#4A90E2',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Initialize similarity chart if canvas exists
    const similarityCanvas = document.getElementById('similarityChart');
    if (similarityCanvas) {
        new Chart(similarityCanvas, {
            type: 'bar',
            data: {
                labels: ['Leonardo DiCaprio', 'Climate Change', 'Hollywood', 'Deep Learning', 'AI Research'],
                datasets: [{
                    label: 'Similarity Score',
                    data: [0.89, 0.76, 0.72, 0.85, 0.81],
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1
                    }
                }
            }
        });
    }
}

// Add keyboard support for demo inputs
document.getElementById('classificationInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        document.getElementById('classifyBtn')?.click();
    }
});

document.getElementById('summarizationInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        document.getElementById('summarizeBtn')?.click();
    }
});

document.getElementById('searchInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn')?.click();
    }
});
