import './App.css'
import QAHomepage from './pages/Home'
import RichTextEditorExample from './components/TextEditor'
import StackItNavbar from './components/Navbar'
import QuestionDetailPage from './pages/Breadcrumb'
import StackItLanding from './pages/Landing'

function App() {

  return (
    <>
    <StackItNavbar/>
   <QAHomepage/>
   <RichTextEditorExample/>
   <QuestionDetailPage/>
   <StackItLanding/>
    </>
  )
}

export default App
