import SignInBox from "./SignInBox";
import type { Metadata } from 'next'


export const metadata:Metadata = {
  title:'Sign In',
  description:'Sign In Via Passwordless Magic Link'
}

const page = () => {
  return (
    <div>
      <SignInBox />
    </div>
  );
};

export default page;
