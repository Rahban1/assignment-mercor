import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useHiringStore } from '../store'
import Card, { CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export const Route = createFileRoute('/candidate/$id')({
  component: CandidateDetail,
})

function CandidateDetail() {
  const params = Route.useParams() as { id: string }
  const id = params.id
  const navigate = useNavigate()
  
  const {
    getApplicantById,
    getApplicantScore,
    isShortlisted,
    isSelected,
    addToShortlist,
    removeFromShortlist,
    selectCandidate,
    unselectCandidate,
    getSelectedCount,
  } = useHiringStore()

  const applicant = getApplicantById(id)
  const score = getApplicantScore(id)
  const shortlisted = isShortlisted(id)
  const selected = isSelected(id)

  if (!applicant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <div className="text-gray-400 text-6xl mb-4">👤</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Candidate Not Found</h2>
            <p className="text-gray-600 mb-4">The candidate you're looking for doesn't exist.</p>
            <Button onClick={() => navigate({ to: '/dashboard' })}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleShortlist = () => {
    if (shortlisted) {
      removeFromShortlist(id)
    } else {
      addToShortlist(id, 'Added from candidate detail page', 'medium')
    }
  }

  const handleSelect = () => {
    if (selected) {
      unselectCandidate(id)
    } else {
      if (getSelectedCount() >= 5) {
        alert('You have already selected 5 candidates. Please remove one before selecting another.')
        return
      }
      selectCandidate(id, 'Team Member', 'Selected from candidate detail page', 'skills')
    }
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
                <h1 className="text-2xl font-bold text-gray-900">{applicant.name}</h1>
                <p className="text-sm text-gray-600">{applicant.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={shortlisted ? "secondary" : "primary"}
                onClick={handleShortlist}
              >
                {shortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
              </Button>
              <Button
                variant={selected ? "secondary" : "success"}
                onClick={handleSelect}
              >
                {selected ? 'Unselect' : 'Select for Team'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{applicant.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{applicant.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900">{applicant.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Work Availability</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {applicant.work_availability.map((availability) => (
                        <Badge key={availability} variant="secondary" size="sm">
                          {availability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Work Experience</h2>
                <div className="space-y-4">
                  {applicant.work_experiences.map((exp, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <h3 className="font-semibold text-gray-900">{exp.roleName}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Highest Level</label>
                    <p className="text-gray-900">{applicant.education.highest_level}</p>
                  </div>
                  {applicant.education.degrees.map((degree, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{degree.degree} in {degree.subject}</h3>
                        <div className="flex space-x-2">
                          {degree.isTop25 && <Badge variant="success" size="sm">Top 25</Badge>}
                          {degree.isTop50 && !degree.isTop25 && <Badge variant="info" size="sm">Top 50</Badge>}
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium">{degree.school}</p>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-gray-600">GPA: </span>
                          <span className="text-gray-900">{degree.gpa}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Period: </span>
                          <span className="text-gray-900">
                            {new Date(degree.startDate).getFullYear()} - {new Date(degree.endDate).getFullYear()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {score && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Candidate Score</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Score</span>
                      <Badge variant="info" className="text-lg px-3 py-1">
                        {score.totalScore}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Experience</span>
                        <span className="text-sm font-medium">{score.experienceScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Education</span>
                        <span className="text-sm font-medium">{score.educationScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Skills</span>
                        <span className="text-sm font-medium">{score.skillScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Salary</span>
                        <span className="text-sm font-medium">{score.salaryScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Diversity</span>
                        <span className="text-sm font-medium">{score.diversityScore}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Salary Expectations</h2>
                <div className="space-y-2">
                  {Object.entries(applicant.annual_salary_expectation)
                    .filter(([_, value]) => value)
                    .map(([type, amount]) => (
                      <div key={type} className="flex justify-between">
                        <span className="text-sm text-gray-600 capitalize">{type.replace('-', ' ')}</span>
                        <span className="text-sm font-medium">{amount}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Submitted</label>
                    <p className="text-gray-900">
                      {new Date(applicant.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="flex space-x-2 mt-1">
                      {shortlisted && <Badge variant="info">Shortlisted</Badge>}
                      {selected && <Badge variant="success">Selected</Badge>}
                      {!shortlisted && !selected && <Badge variant="secondary">Under Review</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}