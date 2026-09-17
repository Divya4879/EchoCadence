import { useSearchParams } from 'react-router-dom'
import FlashcardSession from '../components/FlashcardSession'
export default function Learn() {
  const [params] = useSearchParams()
  return <FlashcardSession mode="learn" languageId={params.get('languageId')} />
}
