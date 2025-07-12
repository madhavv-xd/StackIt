import './App.css'
import QAHomepage from './pages/Home'
import RichTextEditorExample from './components/TextEditor'
import StackItNavbar from './components/Navbar'
import QuestionDetailPage from './pages/Breadcrumb'
import StackItLanding from './pages/Landing'
import {BrowserRouter,Routes,Route,Link,useNavigate,Outlet} from "react-router-dom"
import LoginSignupPage from './pages/Auth'

function App() {

  return (
    <>
  <BrowserRouter>
      
      <Routes>
      <Route path="/" element={<StackItLanding/>} />
      <Route path="/home" element={<><StackItNavbar/> <QAHomepage/></>}/>
      <Route path="/add-new-Ques" element={<><StackItNavbar/><RichTextEditorExample/></>}/>
      <Route path="/auth" element={<LoginSignupPage/>}/>
      
      {/*<Route path="*" element={<NotFound/>}/>
       */}
      </Routes>
      </BrowserRouter>




    {/* <StackItNavbar/>
   <QAHomepage/>*/}
  {/* //  <RichTextEditorExample/>
  //  <QuestionDetailPage/>
  //  <StackItLanding/>  */}
    </>
  )
}

export default App
