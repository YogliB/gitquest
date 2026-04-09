import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { parseRepoInput } from '@/lib/github'
import { LandingTemplate } from '@/components/templates'

export function LandingPage() {
  const navigate = useNavigate()
  const { urlError, setUrlError } = useStore()

  const handleSubmit = (value: string) => {
    const parsed = parseRepoInput(value)
    if (!parsed) {
      setUrlError('Please enter a valid GitHub repo (e.g. owner/repo or full URL)')
      return
    }
    setUrlError(null)
    navigate(`/${parsed.owner}/${parsed.repo}`)
  }

  const handleRepoSelect = (owner: string, repo: string) => {
    setUrlError(null)
    navigate(`/${owner}/${repo}`)
  }

  return (
    <LandingTemplate
      error={urlError}
      onSubmit={handleSubmit}
      onRepoSelect={handleRepoSelect}
    />
  )
}
