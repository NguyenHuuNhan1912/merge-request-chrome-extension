import { useEffect, useState } from "react";
import MergeRequest from "./components/merge-request/MergeRequest";
import NotLogin from "./components/not-login/NotLogin";
import gitlabApi from "./api/modules/gitlab.api";
const App = () => {

  const [isLogin, setIsLogin] = useState(false);

  const getUserApi = async () => {
    try {
      const responseUser = await gitlabApi.getUser();
      if(responseUser) setIsLogin(true);
    }
    catch(err) {
      console.log(`Error: ${err}`);
    }
  }

  useEffect(() => {
    getUserApi();
  }, []);

  return (
    <>
    {
      isLogin ? <MergeRequest />  : <NotLogin/>
    }
    </>
  );
}

export default App;
