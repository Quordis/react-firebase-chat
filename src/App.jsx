import { useEffect, useState } from "react"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"
import ChatDefault from "./components/chat/ChatDefault"

const App = () => {
  const user = false;

  const {currentUser, isLoading, fetchUserInfo} = useUserStore();
  const {chatId} = useChatStore();
  const [showDetail, setShowDetail] = useState(false);
  const [showList, setShowList] = useState(true);

  function changeDetail() {
    setShowDetail(prev => !prev);
  }

  function changeList() {
    document.getElementsByClassName("list")[0].classList.toggle("active");
  }

  useEffect(() => {
    const onSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      onSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List changeList={changeList} />
            {chatId ? <Chat changeDetail={changeDetail} changeList={changeList} /> : <ChatDefault changeList={changeList}/>}
            {showDetail && <Detail changeDetail={changeDetail} />}
          </>
        ) : (<Login />)
      }
      <Notification />
    </div>
  )
}

export default App