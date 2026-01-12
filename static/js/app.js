const { useState, useEffect } = React;

// Supabase Client (will be initialized after config is loaded)
let supabaseClient = null;

// Auth Component
function AuthComponent({ user, onSignIn, onSignOut, supabase }) {
    if (!supabase) {
        return (
            <div className="px-4 py-2 text-sm text-gray-500">
                <i className="fas fa-info-circle mr-2"></i>
                Auth not configured
            </div>
        );
    }

    if (user) {
        return (
            <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-700">
                    <i className="fas fa-user-circle mr-2"></i>
                    {user.email || 'Signed in'}
                </div>
                <button
                    onClick={onSignOut}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={onSignIn}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition flex items-center"
        >
            <i className="fab fa-google mr-2"></i>
            Sign in with Google
        </button>
    );
}

// Main App Component
function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboardStats, setDashboardStats] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [user, setUser] = useState(null);
    const [authConfig, setAuthConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize Supabase and check auth status
    useEffect(() => {
        // Get auth config from backend
        fetch('/api/auth/config')
            .then(res => res.json())
            .then(config => {
                setAuthConfig(config);
                
                if (config.enabled) {
                    // Initialize Supabase client
                    supabaseClient = window.supabase.createClient(config.supabase_url, config.supabase_key);
                    
                    // Check current session
                    supabaseClient.auth.getSession().then(({ data: { session } }) => {
                        if (session) {
                            setUser(session.user);
                        }
                        setLoading(false);
                    });
                    
                    // Listen for auth changes
                    supabaseClient.auth.onAuthStateChange((event, session) => {
                        if (session) {
                            setUser(session.user);
                        } else {
                            setUser(null);
                        }
                    });
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error('Error loading auth config:', err);
                setLoading(false);
            });
    }, []);

    // Helper function to add auth headers to fetch requests
    const fetchWithAuth = async (url, options = {}) => {
        const headers = { ...options.headers, 'Content-Type': 'application/json' };
        
        if (supabaseClient && user) {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }
        }
        
        return fetch(url, { ...options, headers });
    };
    
    // Make fetchWithAuth available globally for components
    window.fetchWithAuth = fetchWithAuth;

    const handleSignIn = async () => {
        if (!supabaseClient) return;
        
        try {
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            
            if (error) {
                console.error('Sign in error:', error);
                alert('Sign in failed: ' + error.message);
            }
        } catch (error) {
            console.error('Sign in error:', error);
            alert('Sign in failed: ' + error.message);
        }
    };

    const handleSignOut = async () => {
        if (!supabaseClient) return;
        
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) {
                console.error('Sign out error:', error);
            } else {
                setUser(null);
                // Reload page to clear any cached data
                window.location.reload();
            }
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const fetchStats = () => {
        fetchWithAuth('/api/dashboard/stats')
            .then(res => res.json())
            .then(data => setDashboardStats(data))
            .catch(err => console.error('Error fetching stats:', err));
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Refresh stats when switching to dashboard
    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchStats();
        }
    }, [activeTab]);

    // Handler for navigating to a specific project
    const handleViewProject = (projectId) => {
        setSelectedProjectId(projectId);
        setActiveTab('projects');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <i className="fas fa-rocket text-indigo-600 text-2xl mr-3"></i>
                            <h1 className="text-xl font-bold text-gray-900">SaaS Workflow Tool</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    activeTab === 'dashboard' 
                                        ? 'bg-indigo-100 text-indigo-700' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-chart-line mr-2"></i>Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('discover')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    activeTab === 'discover' 
                                        ? 'bg-indigo-100 text-indigo-700' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-funnel-dollar mr-2"></i>Idea Funnel
                            </button>
                            <button
                                onClick={() => { setActiveTab('projects'); setSelectedProjectId(null); }}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    activeTab === 'projects' 
                                        ? 'bg-indigo-100 text-indigo-700' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-folder-open mr-2"></i>Projects
                            </button>
                            <AuthComponent 
                                user={user} 
                                onSignIn={handleSignIn} 
                                onSignOut={handleSignOut}
                                supabase={supabaseClient}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && <Dashboard stats={dashboardStats} onViewProject={handleViewProject} onNavigate={setActiveTab} fetchWithAuth={fetchWithAuth} />}
                {activeTab === 'discover' && <DiscoverIdeas fetchWithAuth={fetchWithAuth} />}
                {activeTab === 'projects' && <Projects initialProjectId={selectedProjectId} onClearSelection={() => setSelectedProjectId(null)} fetchWithAuth={fetchWithAuth} />}
            </div>
        </div>
    );
}

// Dashboard Component
function Dashboard({ stats, onViewProject, onNavigate, fetchWithAuth }) {
    const [projects, setProjects] = useState([]);
    const [selectedStage, setSelectedStage] = useState(null);
    
    // Use fetchWithAuth if provided, otherwise use global or regular fetch
    const authFetch = fetchWithAuth || window.fetchWithAuth || fetch;
    
    // Lean AI-Solo Blueprint Phases
    const stages = [
        { name: 'Smoke Test', key: 'smoketest', color: 'bg-amber-500', icon: 'fa-fire' },
        { name: 'Factory Setup', key: 'setup', color: 'bg-blue-500', icon: 'fa-cogs' },
        { name: 'Build', key: 'build', color: 'bg-purple-500', icon: 'fa-code' },
        { name: 'Launch', key: 'launch', color: 'bg-green-500', icon: 'fa-rocket' },
        { name: 'Live', key: 'live', color: 'bg-emerald-600', icon: 'fa-chart-line' },
        { name: 'Killed', key: 'killed', color: 'bg-red-500', icon: 'fa-skull-crossbones' }
    ];

    useEffect(() => {
        authFetch('/api/projects')
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => console.error('Error fetching projects:', err));
    }, []);

    // Count projects per stage
    const getStageCounts = () => {
        const counts = {};
        stages.forEach(stage => {
            counts[stage.key] = projects.filter(p => p.current_stage === stage.key).length;
        });
        return counts;
    };

    const stageCounts = getStageCounts();

    // Get projects for selected stage
    const filteredProjects = selectedStage 
        ? projects.filter(p => p.current_stage === selectedStage)
        : [];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
            
            {/* New Metrics Banner */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* Consistency Score */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <i className="fas fa-chart-line text-3xl text-purple-500"></i>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Consistency Score</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats?.consistency_score || 0}%</dd>
                                    <dd className="text-xs text-gray-400 mt-1">{stats?.days_active || 0} / {stats?.days_in_year || 365} days</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Streak */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <i className="fas fa-fire text-3xl text-orange-500"></i>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Current Streak</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats?.current_streak || 0}</dd>
                                    <dd className="text-xs text-gray-400 mt-1">consecutive days</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stage Velocity */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <i className="fas fa-tachometer-alt text-3xl text-teal-500"></i>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Stage Velocity</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats?.stage_velocity || 0}</dd>
                                    <dd className="text-xs text-gray-400 mt-1">avg days in Smoke Test</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Validation Activity */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <i className="fas fa-bullseye text-3xl text-pink-500"></i>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Validation Activity</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats?.validation_activity || 0}</dd>
                                    <dd className="text-xs text-gray-400 mt-1">actions this week</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div 
                    onClick={() => onNavigate && onNavigate('discover')}
                    className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-yellow-400 transition-all"
                >
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <i className="fas fa-lightbulb text-3xl text-yellow-500"></i>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Ideas</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats?.total_ideas || 0}</dd>
                                </dl>
                            </div>
                            <div className="flex-shrink-0">
                                <i className="fas fa-chevron-right text-gray-400"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div 
                    onClick={() => onNavigate && onNavigate('projects')}
                    className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-blue-400 transition-all"
                >
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <i className="fas fa-tasks text-3xl text-blue-500"></i>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats?.active_projects || 0}</dd>
                                </dl>
                            </div>
                            <div className="flex-shrink-0">
                                <i className="fas fa-chevron-right text-gray-400"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <i className="fas fa-check-circle text-3xl text-green-500"></i>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Live Apps</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats?.live_projects || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <i className="fas fa-dollar-sign text-3xl text-indigo-500"></i>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total MRR</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">${(stats?.total_mrr || 0).toLocaleString()}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workflow Stages */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Workflow Stages</h3>
                <p className="text-sm text-gray-500 mb-4">Click on a stage to see projects</p>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {stages.map((stage) => {
                        const count = stageCounts[stage.key] || 0;
                        const isSelected = selectedStage === stage.key;
                        
                        return (
                            <div 
                                key={stage.key} 
                                className="text-center cursor-pointer group"
                                onClick={() => setSelectedStage(isSelected ? null : stage.key)}
                            >
                                <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex flex-col items-center justify-center transition-all duration-200 ${
                                    isSelected 
                                        ? `${stage.color} text-white ring-4 ring-offset-2 ring-${stage.color.replace('bg-', '')}`
                                        : count > 0 
                                            ? `${stage.color} text-white group-hover:ring-2 group-hover:ring-offset-2`
                                            : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'
                                }`}>
                                    <span className="text-lg font-bold">{count}</span>
                            </div>
                                <p className={`text-sm font-medium ${isSelected ? 'text-indigo-600' : 'text-gray-700'}`}>
                                    {stage.name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Projects List for Selected Stage */}
            {selectedStage && (
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {stages.find(s => s.key === selectedStage)?.name} Projects
                        </h3>
                        <button 
                            onClick={() => setSelectedStage(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <i className="fas fa-folder-open text-4xl mb-2"></i>
                            <p>No projects in this stage yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredProjects.map(project => (
                                <div 
                                    key={project.id} 
                                    onClick={() => onViewProject && onViewProject(project.id)}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer transition-colors"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                            <span>
                                                <i className="fas fa-percent mr-1"></i>
                                                {project.progress}% complete
                                            </span>
                                            {project.target_mrr && (
                                                <span>
                                                    <i className="fas fa-bullseye mr-1"></i>
                                                    Target: ${project.target_mrr.toLocaleString()}
                                                </span>
                                            )}
                                            {project.current_mrr > 0 && (
                                                <span className="text-green-600">
                                                    <i className="fas fa-dollar-sign mr-1"></i>
                                                    MRR: ${project.current_mrr.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full"
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                        <i className="fas fa-chevron-right text-gray-400"></i>
                                    </div>
                        </div>
                    ))}
                </div>
                    )}
            </div>
            )}
        </div>
    );
}

// Idea Funnel Component
function DiscoverIdeas({ fetchWithAuth }) {
    const [ideas, setIdeas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [viewingIdea, setViewingIdea] = useState(null);
    
    // Use fetchWithAuth if provided, otherwise use global or regular fetch
    const authFetch = fetchWithAuth || window.fetchWithAuth || fetch;

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = () => {
        authFetch('/api/app-ideas')
            .then(res => res.json())
            .then(data => setIdeas(data))
            .catch(err => console.error('Error fetching ideas:', err));
    };

    const handleCreateIdea = (ideaData) => {
        return authFetch('/api/app-ideas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ideaData)
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.message || 'Failed to save idea');
                });
            }
            return res.json();
        })
        .then(data => {
            console.log('Idea saved successfully:', data);
            fetchIdeas();
            setShowModal(false);
            // Show success message
            alert('Idea saved successfully!');
        })
        .catch(err => {
            console.error('Error creating idea:', err);
            alert('Error saving idea: ' + err.message);
            throw err; // Re-throw so the form knows there was an error
        });
    };

    const handleStatusChange = (ideaId, newStatus) => {
        fetch(`/api/app-ideas/${ideaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
        .then(() => fetchIdeas())
        .catch(err => console.error('Error updating status:', err));
    };

    if (viewingIdea) {
        return <IdeaFunnelDetailView idea={viewingIdea} onBack={() => setViewingIdea(null)} onUpdate={fetchIdeas} />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Idea Funnel</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    <i className="fas fa-plus mr-2"></i>Log New Idea
                </button>
            </div>

            {/* Ideas Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idea Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitor MRR</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ideas.map(idea => (
                            <tr key={idea.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{idea.name || 'Untitled Idea'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={idea.status || 'Researching'}
                                        onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                                        className={`text-sm rounded-md border-0 focus:ring-2 focus:ring-indigo-500 ${
                                            idea.status === 'Researching' ? 'bg-blue-100 text-blue-800' :
                                            idea.status === 'Validated' ? 'bg-green-100 text-green-800' :
                                            idea.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            idea.status === 'Planning' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        <option value="Researching">Researching</option>
                                        <option value="Validated">Validated</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Planning">Planning</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {idea.competitor_mrr ? `$${idea.competitor_mrr.toLocaleString()}` : '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => setViewingIdea(idea)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {ideas.length === 0 && (
                    <div className="text-center py-12">
                        <i className="fas fa-lightbulb text-6xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">No ideas yet. Click "Log New Idea" to get started!</p>
                    </div>
                )}
            </div>

            {showModal && (
                <LogNewIdeaModal
                    onClose={() => setShowModal(false)}
                    onSave={handleCreateIdea}
                />
            )}
        </div>
    );
}

// Log New Idea Modal Component
function LogNewIdeaModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        problem_to_solve: '',
        competitor_url: '',
        competitor_mrr: '',
        validation_notes: '',
        my_angle: '',
        status: 'Researching'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const submitData = {
            ...formData,
            competitor_mrr: formData.competitor_mrr ? parseFloat(formData.competitor_mrr) : null
        };
        
        try {
            await onSave(submitData);
            // Reset form after successful save
            setFormData({
                name: '',
                problem_to_solve: '',
                competitor_url: '',
                competitor_mrr: '',
                validation_notes: '',
                my_angle: '',
                status: 'Researching'
            });
        } catch (error) {
            console.error('Error in form submission:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-semibold">Log New Idea</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Idea Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., Task Management Tool"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Problem to Solve *</label>
                        <textarea
                            required
                            value={formData.problem_to_solve}
                            onChange={(e) => setFormData({...formData, problem_to_solve: e.target.value})}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="What problem does this idea solve?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Competitor URL</label>
                        <input
                            type="text"
                            value={formData.competitor_url}
                            onChange={(e) => setFormData({...formData, competitor_url: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="www.example.com or https://example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Competitor MRR</label>
                        <input
                            type="number"
                            value={formData.competitor_mrr}
                            onChange={(e) => setFormData({...formData, competitor_mrr: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="15000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Validation Notes</label>
                        <textarea
                            value={formData.validation_notes}
                            onChange={(e) => setFormData({...formData, validation_notes: e.target.value})}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="How does it get traffic? SEO? Ads?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">My Angle</label>
                        <textarea
                            value={formData.my_angle}
                            onChange={(e) => setFormData({...formData, my_angle: e.target.value})}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Cheaper? Better UI? Niched down?"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Idea'}
                        </button>
                    </div>
                </form>
                </div>
            </div>
    );
}

// Idea Funnel Detail View Component
function IdeaFunnelDetailView({ idea, onBack, onUpdate }) {
    const isAlreadyProject = idea.status === 'Planning' || idea.status === 'Rejected';
    
    const handlePromoteToProject = () => {
        if (confirm('Promote this idea to a project? This will start the Lean AI-Solo Blueprint process.')) {
            fetch(`/api/app-ideas/${idea.id}/promote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => {
                        throw new Error(data.error || 'Failed to promote idea');
                    });
                }
                return res.json();
            })
            .then(() => {
                alert('Idea promoted to project! Check the Projects tab.');
                window.location.reload();
            })
            .catch(err => {
                console.error('Error promoting idea:', err);
                alert(err.message || 'Error promoting idea. Please try again.');
            });
        }
    };

    return (
        <div>
            <button onClick={onBack} className="mb-4 text-indigo-600 hover:text-indigo-700">
                <i className="fas fa-arrow-left mr-2"></i>Back to Idea Funnel
            </button>
            
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{idea.name || 'Untitled Idea'}</h2>
                        {isAlreadyProject && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                <i className="fas fa-folder-open mr-2"></i>Already a Project
                            </span>
                        )}
                    </div>
                    {!isAlreadyProject ? (
                        <button
                            onClick={handlePromoteToProject}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
                        >
                            <i className="fas fa-arrow-up mr-2"></i>Promote to Project
                        </button>
                    ) : (
                        <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-md">
                            <i className="fas fa-info-circle mr-2"></i>View in Projects tab
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem to Solve</h3>
                    <p className="text-gray-700 whitespace-pre-line">{idea.problem_to_solve || 'Not specified'}</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Information</h3>
                    <div className="space-y-2">
                        {idea.competitor_url && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">URL</label>
                                <a 
                                    href={idea.competitor_url.startsWith('http') ? idea.competitor_url : `https://${idea.competitor_url}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-indigo-600 hover:underline block"
                                >
                                    {idea.competitor_url}
                                </a>
                            </div>
                        )}
                        {idea.competitor_mrr && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">MRR</label>
                                <p className="text-gray-900 font-semibold">${idea.competitor_mrr.toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Notes</h3>
                    <p className="text-gray-700 whitespace-pre-line">{idea.validation_notes || 'No notes yet'}</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Angle</h3>
                    <p className="text-gray-700 whitespace-pre-line">{idea.my_angle || 'Not specified'}</p>
                </div>
            </div>
        </div>
    );
}

// Idea Detail View Component (keeping old one for backward compatibility)
function IdeaDetailView({ idea, onBack, onUpdate }) {
    return (
        <div>
            <button onClick={onBack} className="mb-4 text-indigo-600 hover:text-indigo-700">
                <i className="fas fa-arrow-left mr-2"></i>Back to Ideas
            </button>
            
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{idea.name}</h2>
                        <p className="text-gray-600">{idea.description}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                                idea.status === 'discovered' ? 'bg-blue-100 text-blue-800' :
                                idea.status === 'evaluating' ? 'bg-yellow-100 text-yellow-800' :
                                idea.status === 'building' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                                {idea.status}
                            </span>
                        </div>
                            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Verification */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        <i className="fas fa-dollar-sign text-green-600 mr-2"></i>Revenue Verification
                    </h3>
                    <div className="space-y-3">
                        {idea.estimated_mrr && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Estimated MRR</label>
                                <p className="text-lg font-semibold text-green-600">${idea.estimated_mrr.toLocaleString()}</p>
                                </div>
                            )}
                        {idea.mrr_range && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">MRR Range</label>
                                <p className="text-gray-900">{idea.mrr_range}</p>
                                </div>
                            )}
                        {idea.revenue_verification_source && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Verification Source</label>
                                <p className="text-gray-900">{idea.revenue_verification_source}</p>
                        </div>
                        )}
                        {idea.revenue_proof_url && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Proof URL</label>
                                <a href={idea.revenue_proof_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                    {idea.revenue_proof_url}
                                </a>
                            </div>
                        )}
                        {idea.revenue_confidence && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Confidence Level</label>
                                <p className="text-gray-900">{idea.revenue_confidence}</p>
                            </div>
                        )}
                        {idea.pricing_model && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Pricing Model</label>
                                <p className="text-gray-900">{idea.pricing_model}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Problem Analysis */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>Problem Analysis
                    </h3>
                    <div className="space-y-3">
                        {idea.problem_statement && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Problem Statement</label>
                                <p className="text-gray-900">{idea.problem_statement}</p>
                            </div>
                        )}
                        {idea.target_audience && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Target Audience</label>
                                <p className="text-gray-900">{idea.target_audience}</p>
                            </div>
                        )}
                        {idea.problem_severity && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Problem Severity</label>
                                <p className="text-gray-900">{idea.problem_severity}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Value Proposition */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        <i className="fas fa-star text-yellow-600 mr-2"></i>Value Proposition
                    </h3>
                    <div className="space-y-3">
                        {idea.value_proposition && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Why People Pay</label>
                                <p className="text-gray-900">{idea.value_proposition}</p>
                            </div>
                        )}
                        {idea.key_benefits && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Key Benefits</label>
                                <p className="text-gray-900">{idea.key_benefits}</p>
                            </div>
                        )}
                        {idea.unique_selling_point && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Unique Selling Point</label>
                                <p className="text-gray-900">{idea.unique_selling_point}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Feature Breakdown */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        <i className="fas fa-list text-blue-600 mr-2"></i>Feature Breakdown
                    </h3>
                    <div className="space-y-3">
                        {idea.core_features && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Core Features (Must-Have)</label>
                                <p className="text-gray-900 whitespace-pre-line">{idea.core_features}</p>
                            </div>
                        )}
                        {idea.nice_to_have_features && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nice-to-Have Features</label>
                                <p className="text-gray-900 whitespace-pre-line">{idea.nice_to_have_features}</p>
                            </div>
                        )}
                        {idea.technical_requirements && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Technical Requirements</label>
                                <p className="text-gray-900 whitespace-pre-line">{idea.technical_requirements}</p>
                            </div>
                        )}
                        {idea.third_party_integrations && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Third-Party Integrations</label>
                                <p className="text-gray-900 whitespace-pre-line">{idea.third_party_integrations}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-4">
                            <button
                                onClick={() => {
                                    if (confirm('Start a project for this idea?')) {
                            fetch('/api/projects', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    app_idea_id: idea.id,
                                    name: idea.name,
                                    target_mrr: idea.estimated_mrr || 15000
                                })
                            })
                            .then(() => {
                                alert('Project created! Navigate to Projects tab to view it.');
                            });
                        }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
                            >
                                <i className="fas fa-play mr-2"></i>Start Project
                            </button>
                        </div>
        </div>
    );
}

// Idea Modal Component
function IdeaModal({ idea, onClose, onSave }) {
    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState({
        name: idea?.name || '',
        description: idea?.description || '',
        mrr_range: idea?.mrr_range || '$10k-30k',
        source_url: idea?.source_url || '',
        difficulty: idea?.difficulty || 'Medium',
        tech_stack: idea?.tech_stack || '',
        market_size: idea?.market_size || '',
        competition_level: idea?.competition_level || '',
        notes: idea?.notes || '',
        status: idea?.status || 'discovered',
        estimated_mrr: idea?.estimated_mrr || '',
        revenue_verification_source: idea?.revenue_verification_source || '',
        revenue_proof_url: idea?.revenue_proof_url || '',
        revenue_confidence: idea?.revenue_confidence || 'Medium',
        pricing_model: idea?.pricing_model || '',
        problem_statement: idea?.problem_statement || '',
        target_audience: idea?.target_audience || '',
        problem_severity: idea?.problem_severity || 'Medium',
        value_proposition: idea?.value_proposition || '',
        key_benefits: idea?.key_benefits || '',
        unique_selling_point: idea?.unique_selling_point || '',
        core_features: idea?.core_features || '',
        nice_to_have_features: idea?.nice_to_have_features || '',
        technical_requirements: idea?.technical_requirements || '',
        third_party_integrations: idea?.third_party_integrations || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            estimated_mrr: formData.estimated_mrr ? parseFloat(formData.estimated_mrr) : null
        };
        
        if (idea) {
            fetch(`/api/app-ideas/${idea.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData)
            })
            .then(() => {
                onClose();
                window.location.reload();
            });
        } else {
            onSave(submitData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-semibold">{idea ? 'Edit Idea' : 'Add New Idea'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                {/* Tabs */}
                <div className="border-b flex space-x-1 px-6">
                    {['basic', 'revenue', 'problem', 'value', 'features'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium capitalize ${
                                activeTab === tab
                                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">App Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">MRR Range</label>
                            <select
                                value={formData.mrr_range}
                                onChange={(e) => setFormData({...formData, mrr_range: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                        <option value="$10k-30k">$10k-30k</option>
                                        <option value="$5k-10k">$5k-10k</option>
                                        <option value="$30k-50k">$30k-50k</option>
                                        <option value="$50k+">$50k+</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
                        <input
                            type="url"
                            value={formData.source_url}
                            onChange={(e) => setFormData({...formData, source_url: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                        <input
                            type="text"
                            value={formData.tech_stack}
                            onChange={(e) => setFormData({...formData, tech_stack: e.target.value})}
                            placeholder="e.g., React, Python, PostgreSQL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                        </div>
                    )}

                    {/* Revenue Verification Tab */}
                    {activeTab === 'revenue' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated MRR ($)</label>
                                <input
                                    type="number"
                                    value={formData.estimated_mrr}
                                    onChange={(e) => setFormData({...formData, estimated_mrr: e.target.value})}
                                    placeholder="e.g., 15000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Verification Source</label>
                                <input
                                    type="text"
                                    value={formData.revenue_verification_source}
                                    onChange={(e) => setFormData({...formData, revenue_verification_source: e.target.value})}
                                    placeholder="e.g., Indie Hackers, Twitter, Product Hunt"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Proof URL</label>
                                <input
                                    type="url"
                                    value={formData.revenue_proof_url}
                                    onChange={(e) => setFormData({...formData, revenue_proof_url: e.target.value})}
                                    placeholder="Link to proof of revenue"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Confidence</label>
                                    <select
                                        value={formData.revenue_confidence}
                                        onChange={(e) => setFormData({...formData, revenue_confidence: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Model</label>
                                    <input
                                        type="text"
                                        value={formData.pricing_model}
                                        onChange={(e) => setFormData({...formData, pricing_model: e.target.value})}
                                        placeholder="e.g., $29/month, Freemium"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Problem Analysis Tab */}
                    {activeTab === 'problem' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
                                <textarea
                                    value={formData.problem_statement}
                                    onChange={(e) => setFormData({...formData, problem_statement: e.target.value})}
                                    rows="4"
                                    placeholder="What problem does this app solve?"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                                <input
                                    type="text"
                                    value={formData.target_audience}
                                    onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                                    placeholder="Who has this problem?"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Problem Severity</label>
                                <select
                                    value={formData.problem_severity}
                                    onChange={(e) => setFormData({...formData, problem_severity: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Value Proposition Tab */}
                    {activeTab === 'value' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Value Proposition</label>
                                <textarea
                                    value={formData.value_proposition}
                                    onChange={(e) => setFormData({...formData, value_proposition: e.target.value})}
                                    rows="3"
                                    placeholder="Why do people pay for this?"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Key Benefits</label>
                                <textarea
                                    value={formData.key_benefits}
                                    onChange={(e) => setFormData({...formData, key_benefits: e.target.value})}
                                    rows="3"
                                    placeholder="Main benefits users get"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unique Selling Point</label>
                                <textarea
                                    value={formData.unique_selling_point}
                                    onChange={(e) => setFormData({...formData, unique_selling_point: e.target.value})}
                                    rows="3"
                                    placeholder="What makes it special?"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    )}

                    {/* Features Tab */}
                    {activeTab === 'features' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Core Features (Must-Have)</label>
                                <textarea
                                    value={formData.core_features}
                                    onChange={(e) => setFormData({...formData, core_features: e.target.value})}
                                    rows="5"
                                    placeholder="List the essential features needed for MVP (one per line)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nice-to-Have Features</label>
                                <textarea
                                    value={formData.nice_to_have_features}
                                    onChange={(e) => setFormData({...formData, nice_to_have_features: e.target.value})}
                                    rows="4"
                                    placeholder="Optional features for later versions"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Technical Requirements</label>
                                <textarea
                                    value={formData.technical_requirements}
                                    onChange={(e) => setFormData({...formData, technical_requirements: e.target.value})}
                                    rows="3"
                                    placeholder="Technical needs, infrastructure, etc."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Third-Party Integrations</label>
                                <textarea
                                    value={formData.third_party_integrations}
                                    onChange={(e) => setFormData({...formData, third_party_integrations: e.target.value})}
                                    rows="3"
                                    placeholder="APIs, services, tools needed"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            {idea ? 'Update' : 'Create'} Idea
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Landing Page Detail View Component
function LandingPageDetailView({ step, project, onBack }) {
    const [formData, setFormData] = useState({
        final_headline_chosen: '',
        headline_variations: '',
        subheadline: '',
        wedge_statement: '',
        cta_button_text: '',
        cta_button_text_custom: '',
        price_shown: '',
        landing_page_url: '',
        visual_proof_url: '',
        launched_status: 'Not started',
        launch_note: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Load existing data
        fetch(`/api/game-plan/${step.id}/data`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    const ctaText = data.cta_button_text || '';
                    setFormData({
                        final_headline_chosen: data.final_headline_chosen || '',
                        headline_variations: data.headline_variations || '',
                        subheadline: data.subheadline || '',
                        wedge_statement: data.wedge_statement || '',
                        cta_button_text: ctaText,
                        cta_button_text_custom: !['Join the Waitlist (free)', 'Pre-order Lifetime Access – $49', 'Pre-order Lifetime Access – $79'].includes(ctaText) && ctaText ? ctaText : '',
                        price_shown: data.price_shown || '',
                        landing_page_url: data.landing_page_url || '',
                        visual_proof_url: data.visual_proof_url || '',
                        launched_status: data.launched_status || 'Not started',
                        launch_note: data.launch_note || ''
                    });
                }
            })
            .catch(err => console.error('Error loading step data:', err));
    }, [step.id]);

    const handleSave = (showAlert = false, navigateBack = false) => {
        setIsSaving(true);
        fetch(`/api/game-plan/${step.id}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                price_shown: formData.price_shown ? parseFloat(formData.price_shown) : null
            })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.message || 'Failed to save data');
                });
            }
            return res.json();
        })
        .then(data => {
            setIsSaving(false);
            if (showAlert) {
                if (navigateBack) {
                    // Navigate back immediately after successful save
                    onBack();
                } else {
                    alert('Saved! Status updated to: ' + data.status);
                }
            }
        })
        .catch(err => {
            console.error('Error saving:', err);
            setIsSaving(false);
            if (showAlert) {
                alert('Error saving data: ' + (err.message || 'Unknown error'));
            }
        });
    };

    const handleFieldChange = (field, value) => {
        setFormData({...formData, [field]: value});
        // Auto-save after a delay (silently, no alert)
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(() => handleSave(false), 2000);
    };

    // Count only required fields (excluding launch_note and cta_button_text_custom)
    const requiredFields = ['final_headline_chosen', 'headline_variations', 'subheadline', 'wedge_statement', 'cta_button_text', 'landing_page_url', 'visual_proof_url', 'launched_status'];
    const filledCount = requiredFields.filter(field => {
        const value = formData[field];
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        return true;
    }).length;
    const totalFields = 8; // launch_note is optional
    const completionPercent = Math.round((filledCount / totalFields) * 100);

    return (
        <div>
            <button onClick={onBack} className="mb-4 text-indigo-600 hover:text-indigo-700">
                <i className="fas fa-arrow-left mr-2"></i>Back to Game Plan
            </button>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                        <p className="text-gray-600 mt-1">{step.description}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Completion</div>
                        <div className="text-2xl font-bold text-indigo-600">{completionPercent}%</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${completionPercent}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Field 1: Final Headline Chosen */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        1. Final Headline Chosen
                    </label>
                    <input
                        type="text"
                        value={formData.final_headline_chosen}
                        onChange={(e) => handleFieldChange('final_headline_chosen', e.target.value)}
                        placeholder="The headline you actually shipped"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Field 2: Headline Variations */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        2. The Other 4 Headline Variations
                    </label>
                    <textarea
                        value={formData.headline_variations}
                        onChange={(e) => handleFieldChange('headline_variations', e.target.value)}
                        rows="6"
                        placeholder="Paste all 5 AI-generated headlines here. Mark the winner with a ✓"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste all 5 variations + mark which one won</p>
                </div>

                {/* Field 3: Sub-headline */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        3. Sub-headline / One-liner
                    </label>
                    <input
                        type="text"
                        value={formData.subheadline}
                        onChange={(e) => handleFieldChange('subheadline', e.target.value)}
                        placeholder="The dead-simple review-response tool that writes perfect replies in seconds"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Field 4: Wedge Statement */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        4. Wedge Statement Visible on Page
                    </label>
                    <input
                        type="text"
                        value={formData.wedge_statement}
                        onChange={(e) => handleFieldChange('wedge_statement', e.target.value)}
                        placeholder="Unlike X, Y, Z we fix [pain] by doing [10× solution]"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Copy-paste exact sentence from previous step</p>
                </div>

                {/* Field 5: CTA Button Text */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        5. CTA Button Text
                    </label>
                    <select
                        value={formData.cta_button_text && ['Join the Waitlist (free)', 'Pre-order Lifetime Access – $49', 'Pre-order Lifetime Access – $79'].includes(formData.cta_button_text) ? formData.cta_button_text : (formData.cta_button_text ? 'Custom' : '')}
                        onChange={(e) => {
                            if (e.target.value === 'Custom') {
                                handleFieldChange('cta_button_text', 'Custom');
                            } else {
                                handleFieldChange('cta_button_text', e.target.value);
                            }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select CTA...</option>
                        <option value="Join the Waitlist (free)">Join the Waitlist (free)</option>
                        <option value="Pre-order Lifetime Access – $49">Pre-order Lifetime Access – $49 (recommended for Smoke Test)</option>
                        <option value="Pre-order Lifetime Access – $79">Pre-order Lifetime Access – $79</option>
                        <option value="Custom">Custom</option>
                    </select>
                    {(formData.cta_button_text === 'Custom' || (formData.cta_button_text && !['Join the Waitlist (free)', 'Pre-order Lifetime Access – $49', 'Pre-order Lifetime Access – $79'].includes(formData.cta_button_text))) && (
                        <input
                            type="text"
                            value={formData.cta_button_text === 'Custom' ? formData.cta_button_text_custom : formData.cta_button_text}
                            onChange={(e) => {
                                setFormData({...formData, cta_button_text: e.target.value, cta_button_text_custom: e.target.value});
                                clearTimeout(window.autoSaveTimeout);
                                window.autoSaveTimeout = setTimeout(() => handleSave(false), 2000);
                            }}
                            placeholder="Enter custom CTA text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    )}
                </div>

                {/* Field 6: Price Shown */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        6. Price Shown (if pre-sale)
                    </label>
                    <div className="flex items-center">
                        <span className="text-gray-500 mr-2">$</span>
                        <input
                            type="number"
                            value={formData.price_shown}
                            onChange={(e) => handleFieldChange('price_shown', e.target.value)}
                            placeholder="49"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Leave blank if waitlist-only</p>
                </div>

                {/* Field 7: Landing Page URL */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        7. Landing Page URL
                    </label>
                    <input
                        type="url"
                        value={formData.landing_page_url}
                        onChange={(e) => handleFieldChange('landing_page_url', e.target.value)}
                        placeholder="https://replyrocket.framer.website or https://yourtool.carrd.co"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Field 8: Visual Proof */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        8. Quick Visual Proof
                    </label>
                    <input
                        type="url"
                        value={formData.visual_proof_url}
                        onChange={(e) => handleFieldChange('visual_proof_url', e.target.value)}
                        placeholder="Paste image URL or screenshot link"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                    />
                    {formData.visual_proof_url && (
                        <img 
                            src={formData.visual_proof_url} 
                            alt="Landing page preview" 
                            className="mt-2 max-w-full h-auto rounded border border-gray-200"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    )}
                    <p className="text-xs text-gray-500 mt-1">Screenshot or live embed URL</p>
                </div>

                {/* Field 9: Launched Status */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        9. Launched?
                    </label>
                    <div className="flex space-x-4 mb-4">
                        {['Not started', 'Building', 'Live'].map(status => (
                            <button
                                key={status}
                                onClick={() => handleFieldChange('launched_status', status)}
                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                    formData.launched_status === status
                                        ? status === 'Live' 
                                            ? 'bg-green-600 text-white shadow-lg'
                                            : status === 'Building'
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-gray-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={formData.launch_note}
                        onChange={(e) => handleFieldChange('launch_note', e.target.value)}
                        rows="2"
                        placeholder="Optional one-line note..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Save Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onBack}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSave(true, true)}
                        disabled={isSaving}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save & Update Status'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Step Detail View Component (Deep Competitive Recon)
function StepDetailView({ step, project, onBack }) {
    const [formData, setFormData] = useState({
        competitors_looked_at: '',
        where_got_reviews: '',
        pain_point_1: '',
        pain_point_2: '',
        pain_point_3: '',
        my_wedge: '',
        how_solve_10x_better: '',
        confidence_check: null,
        go_no_go: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Load existing data
        fetch(`/api/game-plan/${step.id}/data`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setFormData({
                        competitors_looked_at: data.competitors_looked_at || '',
                        where_got_reviews: data.where_got_reviews || '',
                        pain_point_1: data.pain_point_1 || '',
                        pain_point_2: data.pain_point_2 || '',
                        pain_point_3: data.pain_point_3 || '',
                        my_wedge: data.my_wedge || '',
                        how_solve_10x_better: data.how_solve_10x_better || '',
                        confidence_check: data.confidence_check || null,
                        go_no_go: data.go_no_go || ''
                    });
                }
            })
            .catch(err => console.error('Error loading step data:', err));
    }, [step.id]);

    const handleSave = (showAlert = false, navigateBack = false) => {
        setIsSaving(true);
        fetch(`/api/game-plan/${step.id}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            setIsSaving(false);
            if (showAlert) {
                // If navigating back, show brief message then navigate
                if (navigateBack) {
                    setTimeout(() => {
                        onBack();
                    }, 500);
                } else {
                    alert('Saved! Status updated to: ' + data.status);
                }
            }
        })
        .catch(err => {
            console.error('Error saving:', err);
            setIsSaving(false);
            if (showAlert) {
                alert('Error saving data');
            }
        });
    };

    const handleFieldChange = (field, value) => {
        setFormData({...formData, [field]: value});
        // Auto-save after a delay (silently, no alert)
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(() => handleSave(false), 2000);
    };

    const filledCount = Object.values(formData).filter(v => v !== '' && v !== null).length;
    const totalFields = 9;
    const completionPercent = Math.round((filledCount / totalFields) * 100);

    return (
        <div>
            <button onClick={onBack} className="mb-4 text-indigo-600 hover:text-indigo-700">
                <i className="fas fa-arrow-left mr-2"></i>Back to Game Plan
            </button>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                        <p className="text-gray-600 mt-1">{step.description}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Completion</div>
                        <div className="text-2xl font-bold text-indigo-600">{completionPercent}%</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${completionPercent}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Field 1: Competitors I Looked At */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        1. Competitors I Looked At
                    </label>
                    <input
                        type="text"
                        value={formData.competitors_looked_at}
                        onChange={(e) => handleFieldChange('competitors_looked_at', e.target.value)}
                        placeholder="Carrd, Tally, Typeform, Softr"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated list</p>
                </div>

                {/* Field 2: Where I Got Reviews */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        2. Where I Got Reviews
                    </label>
                    <textarea
                        value={formData.where_got_reviews}
                        onChange={(e) => handleFieldChange('where_got_reviews', e.target.value)}
                        rows="3"
                        placeholder="App Store 1–2★ section, G2, Trustpilot, Reddit threads"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Field 3-5: Pain Points */}
                {[1, 2, 3].map(num => (
                    <div key={num} className="bg-white shadow rounded-lg p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {num + 2}. Pain Point #{num} – Most common or angriest
                        </label>
                        <textarea
                            value={formData[`pain_point_${num}`]}
                            onChange={(e) => handleFieldChange(`pain_point_${num}`, e.target.value)}
                            rows="4"
                            placeholder={`Pain point description + 1-2 example quotes`}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                ))}

                {/* Field 6: My Wedge */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        6. My Wedge
                    </label>
                    <select
                        value={formData.my_wedge}
                        onChange={(e) => handleFieldChange('my_wedge', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select a pain point...</option>
                        <option value="Pain #1">Pain #1</option>
                        <option value="Pain #2">Pain #2</option>
                        <option value="Pain #3">Pain #3</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Pick exactly one pain point to solve</p>
                </div>

                {/* Field 7: How I Will Solve It 10× Better */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        7. How I Will Solve It 10× Better
                    </label>
                    <textarea
                        value={formData.how_solve_10x_better}
                        onChange={(e) => handleFieldChange('how_solve_10x_better', e.target.value)}
                        rows="5"
                        placeholder="One paragraph describing your solution..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">The single most important box</p>
                </div>

                {/* Field 8: Confidence Check + Go/No-Go */}
                <div className="bg-white shadow rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        8. Quick Confidence Check
                    </label>
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Confidence Level</span>
                            <span className="text-lg font-bold text-indigo-600">
                                {formData.confidence_check || 0}/10
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={formData.confidence_check || 1}
                            onChange={(e) => handleFieldChange('confidence_check', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Low</span>
                            <span>High</span>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleFieldChange('go_no_go', 'go')}
                            className={`flex-1 py-4 rounded-lg font-bold text-lg transition-all ${
                                formData.go_no_go === 'go'
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                            }`}
                        >
                            <i className="fas fa-check-circle mr-2"></i>GO
                        </button>
                        <button
                            onClick={() => handleFieldChange('go_no_go', 'no-go')}
                            className={`flex-1 py-4 rounded-lg font-bold text-lg transition-all ${
                                formData.go_no_go === 'no-go'
                                    ? 'bg-red-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                            }`}
                        >
                            <i className="fas fa-times-circle mr-2"></i>NO-GO
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onBack}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSave(true, true)}
                        disabled={isSaving}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save & Update Status'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Projects Component
function Projects({ initialProjectId, onClearSelection, fetchWithAuth }) {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    
    // Use fetchWithAuth if provided, otherwise use global or regular fetch
    const authFetch = fetchWithAuth || window.fetchWithAuth || fetch;

    useEffect(() => {
        fetchProjects();
    }, []);

    // Auto-select project if initialProjectId is provided
    useEffect(() => {
        if (initialProjectId && projects.length > 0) {
            const project = projects.find(p => p.id === initialProjectId);
            if (project) {
                setSelectedProject(project);
            }
        }
    }, [initialProjectId, projects]);

    // Refresh projects when window regains focus (user comes back to tab)
    useEffect(() => {
        const handleFocus = () => {
            fetchProjects();
        };
        window.addEventListener('focus', handleFocus);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const fetchProjects = () => {
        authFetch('/api/projects')
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => console.error('Error fetching projects:', err));
    };

    const handleBack = () => {
        setSelectedProject(null);
        if (onClearSelection) {
            onClearSelection();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
            </div>

            {selectedProject ? (
                <ProjectDetail project={selectedProject} onBack={handleBack} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => {
                        const isKilled = project.current_stage === 'killed';
                        const isLive = project.current_stage === 'live';
                        
                        return (
                        <div
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                                className={`shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                                    isKilled 
                                        ? 'bg-red-50 border-2 border-red-200 opacity-75' 
                                        : isLive 
                                            ? 'bg-green-50 border-2 border-green-200'
                                            : 'bg-white'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`text-lg font-semibold ${isKilled ? 'text-red-700' : 'text-gray-900'}`}>
                                        {project.name}
                                    </h3>
                                    {isKilled && (
                                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                                            <i className="fas fa-skull-crossbones mr-1"></i>Killed
                                        </span>
                                    )}
                                    {isLive && (
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                            <i className="fas fa-check-circle mr-1"></i>Live
                                        </span>
                                    )}
                                </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <i className="fas fa-layer-group mr-2"></i>
                                        <span className="capitalize">Stage: {project.current_stage}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <i className="fas fa-percent mr-2"></i>
                                    <span>Progress: {project.progress}%</span>
                                </div>
                                {project.current_mrr > 0 && (
                                    <div className="flex items-center text-sm text-green-600">
                                        <i className="fas fa-dollar-sign mr-2"></i>
                                            <span>MRR: ${project.current_mrr.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                                <div className={`w-full rounded-full h-2 ${isKilled ? 'bg-red-200' : 'bg-gray-200'}`}>
                                <div
                                        className={`h-2 rounded-full ${isKilled ? 'bg-red-400' : isLive ? 'bg-green-500' : 'bg-indigo-600'}`}
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Project Detail Component
function ProjectDetail({ project, onBack }) {
    const [tasks, setTasks] = useState([]);
    const [gamePlan, setGamePlan] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedStep, setSelectedStep] = useState(null);

    useEffect(() => {
        fetch(`/api/projects/${project.id}/tasks`)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error('Error fetching tasks:', err));
        
        fetch(`/api/projects/${project.id}/game-plan`)
            .then(res => res.json())
            .then(data => setGamePlan(data))
            .catch(err => console.error('Error fetching game plan:', err));
    }, [project.id]);

    // Lean AI-Solo Blueprint Phases
    const phases = [
        { key: 'smoketest', name: 'Smoke Test', icon: 'fa-fire', color: 'amber' },
        { key: 'setup', name: 'Factory Setup', icon: 'fa-cogs', color: 'blue' },
        { key: 'build', name: 'Build', icon: 'fa-code', color: 'purple' },
        { key: 'launch', name: 'Launch', icon: 'fa-rocket', color: 'green' },
        { key: 'live', name: 'Live', icon: 'fa-chart-line', color: 'emerald' }
    ];
    const currentPhaseIndex = phases.findIndex(p => p.key === project.current_stage);

    const handleGenerateGamePlan = () => {
        fetch(`/api/projects/${project.id}/generate-game-plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
            fetch(`/api/projects/${project.id}/game-plan`)
                .then(res => res.json())
                .then(data => setGamePlan(data));
        });
    };

    const handleKillProject = () => {
        if (confirm('Kill this project? This marks it as dead (validation failed). The idea will be marked as Rejected. You can revive it later.')) {
            fetch(`/api/projects/${project.id}/kill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(() => {
                alert('Project killed. Idea marked as Rejected.');
                window.location.reload();
            })
            .catch(err => {
                console.error('Error killing project:', err);
                alert('Error killing project.');
            });
        }
    };

    const handleReviveProject = () => {
        if (confirm('Revive this project? It will start over from the Smoke Test phase.')) {
            fetch(`/api/projects/${project.id}/revive`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(() => {
                alert('Project revived! Starting from Smoke Test.');
                window.location.reload();
            })
            .catch(err => {
                console.error('Error reviving project:', err);
                alert('Error reviving project.');
            });
        }
    };

    const handleDeleteProject = () => {
        if (confirm('DELETE this project permanently? This cannot be undone. All game plan progress and tasks will be lost. The idea can be promoted again.')) {
            fetch(`/api/projects/${project.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(() => {
                alert('Project deleted. You can promote the idea again.');
                onBack();
            })
            .catch(err => {
                console.error('Error deleting project:', err);
                alert('Error deleting project.');
            });
        }
    };

    const isKilled = project.current_stage === 'killed';

    return (
        <div>
            <button onClick={onBack} className="mb-4 text-indigo-600 hover:text-indigo-700">
                <i className="fas fa-arrow-left mr-2"></i>Back to Projects
            </button>
            
            {/* Project Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{project.name}</h2>
                    {isKilled && (
                        <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            <i className="fas fa-skull-crossbones mr-2"></i>Project Killed (Validation Failed)
                        </span>
                    )}
                </div>
                <div className="flex space-x-2">
                    {isKilled ? (
                        <>
                            <button
                                onClick={handleReviveProject}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                <i className="fas fa-heart mr-2"></i>Revive Project
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                <i className="fas fa-trash mr-2"></i>Delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleKillProject}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                                title="Mark as dead - validation failed"
                            >
                                <i className="fas fa-times-circle mr-2"></i>Kill Project
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                title="Delete permanently"
                            >
                                <i className="fas fa-trash mr-2"></i>Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
                <div className="flex space-x-1">
                    {['overview', 'gameplan', 'tasks'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium capitalize ${
                                activeTab === tab
                                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab === 'gameplan' ? 'Game Plan' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Phase Progress - Lean AI-Solo Blueprint */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-2">Lean AI-Solo Blueprint Progress</h3>
                        <p className="text-sm text-gray-500 mb-4">Your path from idea to $20k MRR</p>
                <div className="flex justify-between items-center">
                            {phases.map((phase, index) => (
                                <div key={phase.key} className="flex-1 text-center relative">
                                    {/* Connecting Line */}
                                    {index < phases.length - 1 && (
                                        <div className={`absolute top-6 left-1/2 w-full h-1 ${
                                            index < currentPhaseIndex ? 'bg-green-500' : 'bg-gray-200'
                                        }`}></div>
                                    )}
                                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center relative z-10 ${
                                        index < currentPhaseIndex ? 'bg-green-500 text-white' :
                                        index === currentPhaseIndex ? `bg-${phase.color}-500 text-white ring-4 ring-${phase.color}-200` :
                                        'bg-gray-200 text-gray-500'
                                    }`}>
                                        {index < currentPhaseIndex 
                                            ? <i className="fas fa-check"></i> 
                                            : <i className={`fas ${phase.icon}`}></i>
                                        }
                            </div>
                                    <p className={`text-xs font-medium ${
                                        index === currentPhaseIndex ? 'text-gray-900' : 'text-gray-500'
                                    }`}>{phase.name}</p>
                        </div>
                    ))}
                </div>
            </div>

                    {/* Project Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Progress</h4>
                            <p className="text-3xl font-bold text-gray-900">{project.progress}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Current MRR</h4>
                            <p className="text-3xl font-bold text-green-600">${(project.current_mrr || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Target MRR</h4>
                            <p className="text-3xl font-bold text-gray-900">${(project.target_mrr || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Game Plan Tab - Lean AI-Solo Blueprint */}
            {activeTab === 'gameplan' && selectedStep ? (
                selectedStep.title.includes('Facade Landing Page') || selectedStep.title.includes('Build Facade') ? (
                    <LandingPageDetailView 
                        step={selectedStep} 
                        project={project}
                        onBack={() => {
                            setSelectedStep(null);
                            // Refresh game plan to get updated status
                            fetch(`/api/projects/${project.id}/game-plan`)
                                .then(res => res.json())
                                .then(data => setGamePlan(data));
                            // Refresh project data to get updated progress
                            fetch(`/api/projects/${project.id}`)
                                .then(res => res.json())
                                .then(data => {
                                    // Update the project object
                                    Object.assign(project, data);
                                });
                        }}
                    />
                ) : (
                    <StepDetailView 
                        step={selectedStep} 
                        project={project}
                        onBack={() => {
                            setSelectedStep(null);
                            // Refresh game plan to get updated status
                            fetch(`/api/projects/${project.id}/game-plan`)
                                .then(res => res.json())
                                .then(data => setGamePlan(data));
                            // Refresh project data to get updated progress
                            fetch(`/api/projects/${project.id}`)
                                .then(res => res.json())
                                .then(data => {
                                    // Update the project object
                                    Object.assign(project, data);
                                });
                        }}
                    />
                )
            ) : activeTab === 'gameplan' && (
                <div>
                    {gamePlan.length === 0 ? (
                        <div className="bg-white shadow rounded-lg p-8 text-center">
                            <div className="mb-4">
                                <i className="fas fa-bolt text-5xl text-amber-500 mb-4"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Lean AI-Solo Blueprint</h3>
                            <p className="text-gray-500 mb-6">Generate a proven 4-phase game plan to go from idea to $20k MRR</p>
                            <button
                                onClick={handleGenerateGamePlan}
                                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-medium text-lg shadow-lg"
                            >
                                <i className="fas fa-magic mr-2"></i>Generate Blueprint
                            </button>
                        </div>
                    ) : (
                        <div>
                            {/* Phase Headers */}
                            {[
                                { key: 'phase1_smoketest', name: 'Phase 1: Smoke Test', subtitle: 'Commercial Validation', color: 'amber', icon: 'fa-fire', gate: '10+ signups or 1 pre-sale' },
                                { key: 'phase2_setup', name: 'Phase 2: Factory Setup', subtitle: 'Standardization', color: 'blue', icon: 'fa-cogs', gate: 'Hello World app live with login' },
                                { key: 'phase3_build', name: 'Phase 3: The Build', subtitle: 'AI-Assisted Development', color: 'purple', icon: 'fa-code', gate: 'User can use core feature' },
                                { key: 'phase4_launch', name: 'Phase 4: Launch & Ops', subtitle: 'Path to $20k MRR', color: 'green', icon: 'fa-rocket', gate: 'Customers retaining' }
                            ].map(phase => {
                                const phaseSteps = gamePlan.filter(s => s.category === phase.key);
                                const completedSteps = phaseSteps.filter(s => s.status === 'completed').length;
                                const totalSteps = phaseSteps.length;
                                const isPhaseComplete = completedSteps === totalSteps && totalSteps > 0;
                                
                                if (phaseSteps.length === 0) return null;
                                
                                return (
                                    <div key={phase.key} className="mb-8">
                                        {/* Phase Header */}
                                        <div className={`bg-${phase.color}-50 border-l-4 border-${phase.color}-500 p-4 mb-4 rounded-r-lg`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <i className={`fas ${phase.icon} text-${phase.color}-500 text-2xl mr-3`}></i>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">{phase.name}</h3>
                                                        <p className="text-sm text-gray-600">{phase.subtitle}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm font-medium ${isPhaseComplete ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {completedSteps}/{totalSteps} steps
                                                    </div>
                                                    <div className="text-xs text-gray-400">Gate: {phase.gate}</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Phase Steps */}
                                        <div className="space-y-3 ml-4">
                                            {phaseSteps.map((step) => {
                                                const isGate = step.title.includes('GATE CHECK');
                                                
                                                return (
                                                    <div 
                                                        key={step.id} 
                                                        onClick={() => {
                                                            // Allow clicking non-gate steps that have detail views
                                                            const hasDetailView = !isGate && (
                                                                step.title.includes('Deep Competitive Recon') ||
                                                                step.title.includes('Facade Landing Page') ||
                                                                step.title.includes('Build Facade')
                                                            );
                                                            if (hasDetailView) {
                                                                setSelectedStep(step);
                                                            }
                                                        }}
                                                        className={`bg-white shadow rounded-lg p-4 border-l-4 ${
                                                            isGate 
                                                                ? 'border-red-500 bg-red-50' 
                                                                : step.status === 'completed' 
                                                                    ? 'border-green-500' 
                                                                    : step.status === 'in_progress'
                                                                        ? 'border-blue-500'
                                                                        : 'border-gray-200'
                                                        } ${
                                                            !isGate && (step.title.includes('Deep Competitive Recon') || step.title.includes('Facade Landing Page') || step.title.includes('Build Facade'))
                                                                ? 'cursor-pointer hover:shadow-md transition-shadow' 
                                                                : ''
                                                        }`}
                                                    >
                                                        <div className="flex items-start">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                                                                step.status === 'completed' ? 'bg-green-600 text-white' :
                                                                step.status === 'in_progress' ? 'bg-blue-600 text-white' :
                                                                isGate ? 'bg-red-100 text-red-600' :
                                                                'bg-gray-100 text-gray-500'
                                                            }`}>
                                                                {step.status === 'completed' 
                                                                    ? <i className="fas fa-check text-sm"></i> 
                                                                    : isGate 
                                                                        ? <i className="fas fa-exclamation text-sm"></i>
                                                                        : <span className="text-sm font-medium">{step.step_number}</span>
                                                                }
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <div className="flex items-center">
                                                                        <h4 className={`font-semibold ${isGate ? 'text-red-800' : 'text-gray-900'}`}>
                                                                            {step.title}
                                                                        </h4>
                                                                        {!isGate && (step.title.includes('Deep Competitive Recon') || step.title.includes('Facade Landing Page') || step.title.includes('Build Facade')) && (
                                                                            <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded">
                                                                                <i className="fas fa-edit mr-1"></i>Click to fill out
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <select
                                                                        value={step.status}
                                                                        onChange={(e) => {
                                                                            fetch(`/api/game-plan/${step.id}`, {
                                                                                method: 'PUT',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                body: JSON.stringify({ status: e.target.value })
                                                                            })
                                                                            .then(() => {
                                                                                fetch(`/api/projects/${project.id}/game-plan`)
                                                                                    .then(res => res.json())
                                                                                    .then(data => setGamePlan(data));
                                                                            });
                                                                        }}
                                                                        className={`text-xs border rounded px-2 py-1 flex-shrink-0 ${
                                                                            step.status === 'completed' ? 'bg-green-100 border-green-300' :
                                                                            step.status === 'in_progress' ? 'bg-blue-100 border-blue-300' :
                                                                            'bg-gray-50 border-gray-200'
                                                                        }`}
                                                                    >
                                                                        <option value="pending">Pending</option>
                                                                        <option value="in_progress">In Progress</option>
                                                                        <option value="completed">Completed</option>
                                                                    </select>
                                                                </div>
                                                                <p className={`text-sm mt-1 ${isGate ? 'text-red-700 font-medium' : 'text-gray-600'}`}>
                                                                    {step.description}
                                                                </p>
                                                                {step.estimated_hours > 0 && (
                                                                    <div className="mt-2 text-xs text-gray-400">
                                                                        <i className="fas fa-clock mr-1"></i>{step.estimated_hours} hours estimated
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* Regenerate Button */}
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => {
                                        if (confirm('This will reset all game plan progress. Are you sure?')) {
                                            handleGenerateGamePlan();
                                        }
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-sm"
                                >
                                    <i className="fas fa-redo mr-1"></i>Regenerate Blueprint
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Tasks</h3>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm">
                        <i className="fas fa-plus mr-2"></i>Add Task
                    </button>
                </div>
                <div className="space-y-2">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center p-3 border border-gray-200 rounded-md">
                            <input
                                type="checkbox"
                                checked={task.status === 'completed'}
                                onChange={(e) => {
                                    fetch(`/api/tasks/${task.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ status: e.target.checked ? 'completed' : 'todo' })
                                    })
                                        .then(() => {
                                            fetch(`/api/projects/${project.id}/tasks`)
                                                .then(res => res.json())
                                                .then(data => setTasks(data));
                                        });
                                }}
                                className="mr-3"
                            />
                            <div className="flex-1">
                                <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                                    {task.title}
                                </p>
                                {task.description && (
                                    <p className="text-sm text-gray-500">{task.description}</p>
                                )}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {task.priority}
                            </span>
                        </div>
                    ))}
                        {tasks.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No tasks yet. Add your first task!</p>
                        )}
                </div>
            </div>
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
