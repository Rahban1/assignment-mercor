import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useHiringStore } from '../store'
import Card, { CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { UsersIcon } from '../components/ui/Icons'

export const Route = createFileRoute('/selection')({
  component: Selection,
})

function Selection() {
  const navigate = useNavigate()
  
  const {
    selected,
    getApplicantById,
    getApplicantScore,
    unselectCandidate,
  } = useHiringStore()

  const selectedApplicants = Object.keys(selected).map(id => {
    const applicant = getApplicantById(id)
    const score = getApplicantScore(id)
    const selectionInfo = selected[id]
    return { applicant, score, selectionInfo }
  }).filter(item => item.applicant)

  const handleRemoveFromTeam = (applicantId: string) => {
    unselectCandidate(applicantId)
  }

  const handleViewDetails = (applicantId: string) => {
    navigate({ to: '/candidate/$id', params: { id: applicantId } })
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
                <h1 className="text-2xl font-bold text-gray-900">Team Selection</h1>
                <p className="text-sm text-gray-600">
                  {selectedApplicants.length} of 5 candidates selected
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="success" className="text-lg px-3 py-1">
                {selectedApplicants.length}/5 Selected
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedApplicants.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <UsersIcon size={64} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No candidates selected
              </h3>
              <p className="text-gray-600 mb-4">
                Start building your team by selecting candidates from the dashboard
              </p>
              <Button 
                variant="primary" 
                onClick={() => navigate({ to: '/dashboard' })}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedApplicants.map(({ applicant, score, selectionInfo }) => (
                <Card key={applicant?.id} className="border-2 border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {applicant?.name}
                        </h3>
                        <p className="text-sm text-gray-600">{selectionInfo.position}</p>
                      </div>
                      {score && (
                        <Badge variant="info" className="text-sm">
                          Score: {score.totalScore}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                          Location
                        </label>
                        <p className="text-sm text-gray-900">{applicant?.location}</p>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                          Experience
                        </label>
                        <p className="text-sm text-gray-900">
                          {applicant?.work_experiences.length} positions
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                          Education
                        </label>
                        <p className="text-sm text-gray-900">
                          {applicant?.education.highest_level}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                          Key Skills
                        </label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {applicant?.skills.slice(0, 3).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" size="sm">
                              {skill}
                            </Badge>
                          ))}
                          {applicant && applicant.skills.length > 3 && (
                            <Badge variant="secondary" size="sm">
                              +{applicant.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                          Selection Reason
                        </label>
                        <p className="text-sm text-gray-900">{selectionInfo.reason}</p>
                      </div>

                      {selectionInfo.diversityFactor && (
                        <div>
                          <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                            Diversity Factor
                          </label>
                          <Badge variant="info" size="sm" className="mt-1">
                            {selectionInfo.diversityFactor}
                          </Badge>
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                          Selected On
                        </label>
                        <p className="text-sm text-gray-900">
                          {new Date(selectionInfo.selectedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4 pt-4 border-t border-green-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applicant && handleViewDetails(applicant.id)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => applicant && handleRemoveFromTeam(applicant.id)}
                        className="flex-1"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {selectedApplicants.length < 5 && (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-gray-400 text-4xl mb-4">+</div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Add Team Member
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      {5 - selectedApplicants.length} more positions available
                    </p>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => navigate({ to: '/dashboard' })}
                    >
                      Browse Candidates
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {selectedApplicants.length === 5 && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-green-600 text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-green-900 mb-2">
                    Team Complete!
                  </h2>
                  <p className="text-green-700 mb-6">
                    You have successfully selected all 5 team members. Your team is ready!
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="success"
                      onClick={() => navigate({ to: '/reports' })}
                    >
                      View Team Analytics
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => navigate({ to: '/dashboard' })}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  )
}