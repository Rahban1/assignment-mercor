import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useHiringStore } from '../store'
import Card, { CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export const Route = createFileRoute('/reports')({
  component: Reports,
})

function Reports() {
  const navigate = useNavigate()
  
  const {
    applicants,
    selected,
    diversityMetrics,
    getApplicantById,
  } = useHiringStore()

  const selectedApplicants = Object.keys(selected).map(id => getApplicantById(id)).filter((a): a is NonNullable<typeof a> => Boolean(a))

  const teamStats = {
    totalCandidates: applicants.length,
    selectedCandidates: selectedApplicants.length,
    locations: [...new Set(selectedApplicants.map(a => a!.location))],
    educationLevels: [...new Set(selectedApplicants.map(a => a!.education.highest_level))],
    topSchoolCount: selectedApplicants.filter(a => 
      a!.education.degrees.some(d => d.isTop25 || d.isTop50)
    ).length,
    averageExperience: Math.round(
      selectedApplicants.reduce((sum, a) => sum + a!.work_experiences.length, 0) / selectedApplicants.length
    ),
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate({ to: '/dashboard' })}
              >
                ← Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-sm text-gray-600">Hiring insights and diversity metrics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Selection Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{teamStats.totalCandidates}</div>
                    <div className="text-sm text-gray-600">Total Candidates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{teamStats.selectedCandidates}</div>
                    <div className="text-sm text-gray-600">Selected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{teamStats.locations.length}</div>
                    <div className="text-sm text-gray-600">Unique Locations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{teamStats.averageExperience}</div>
                    <div className="text-sm text-gray-600">Avg Experience</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {diversityMetrics && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Candidate Pool Diversity</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Geographic Distribution</h3>
                      <div className="space-y-2">
                        {Object.entries(diversityMetrics.locations)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([location, count]) => (
                            <div key={location} className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">{location}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-2 bg-blue-500 rounded-full"
                                    style={{ width: `${(count / Math.max(...Object.values(diversityMetrics.locations))) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Education Levels</h3>
                      <div className="space-y-2">
                        {Object.entries(diversityMetrics.educationLevels)
                          .sort(([,a], [,b]) => b - a)
                          .map(([level, count]) => (
                            <div key={level} className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">{level}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-2 bg-green-500 rounded-full"
                                    style={{ width: `${(count / Math.max(...Object.values(diversityMetrics.educationLevels))) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Experience Levels</h3>
                      <div className="space-y-2">
                        {Object.entries(diversityMetrics.experienceLevels)
                          .sort(([,a], [,b]) => b - a)
                          .map(([level, count]) => (
                            <div key={level} className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">{level}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-2 bg-purple-500 rounded-full"
                                    style={{ width: `${(count / Math.max(...Object.values(diversityMetrics.experienceLevels))) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Top Schools</h3>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">{diversityMetrics.topSchools}</div>
                        <div className="text-sm text-gray-600">candidates from top-ranked schools</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedApplicants.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Selected Team Diversity</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Team Locations</h3>
                      <div className="flex flex-wrap gap-2">
                        {teamStats.locations.map((location) => (
                          <Badge key={location} variant="info">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Education Backgrounds</h3>
                      <div className="flex flex-wrap gap-2">
                        {teamStats.educationLevels.map((level) => (
                          <Badge key={level} variant="secondary">
                            {level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{teamStats.topSchoolCount}</div>
                        <div className="text-sm text-gray-600">Top School Graduates</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{teamStats.locations.length}</div>
                        <div className="text-sm text-gray-600">Different Locations</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{teamStats.educationLevels.length}</div>
                        <div className="text-sm text-gray-600">Education Levels</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => navigate({ to: '/dashboard' })}
                  >
                    Back to Dashboard
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => navigate({ to: '/selection' })}
                  >
                    View Selected Team
                  </Button>
                </div>
              </CardContent>
            </Card>

            {diversityMetrics && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Pool Statistics</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Total Candidates</label>
                      <p className="text-2xl font-bold text-gray-900">{applicants.length}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Average Salary Expectation</label>
                      <p className="text-lg font-semibold text-green-600">
                        ${diversityMetrics.averageSalary.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Geographic Diversity</label>
                      <p className="text-lg font-semibold text-blue-600">
                        {Object.keys(diversityMetrics.locations).length} locations
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}