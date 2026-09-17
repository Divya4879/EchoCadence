import { useSearchParams } from 'react-router-dom'
import FlashcardSession from '../components/FlashcardSession'
export default function Revise() {
  const [params] = useSearchParams()
  return <FlashcardSession mode="revise" languageId={params.get('languageId')} />
}
