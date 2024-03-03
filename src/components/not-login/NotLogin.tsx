import notLogin from '@/assets/not-login.jpg';
import { YOUR_DOMAIN } from '@/shares/constants/api.enum';
const NotLogin = () => {
  return (
    <section className="flex flex-col p-[20px]">
        <img src={notLogin} alt="no-login" className="h-[300px] rounded-[5px]"/>
        <a 
          href={`https://gitlab.${YOUR_DOMAIN}.com/users/sign_in`}
          target="_blank"
          className="base-button hover:text-white hover:bg-main-color mt-[20px]"
        >
            LOGIN WITH GITLAB
        </a>
      </section>
  )
}

export default NotLogin;