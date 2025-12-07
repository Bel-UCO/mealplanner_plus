import { Button, Image } from "react-native"
import GuestLayout from "../layout/GuestLayout"

const Login = ()=>{
    return (<GuestLayout>
        <Image source={require("../resource/mealplanner.png")}></Image>
        <Button  title="Login"></Button>
    </GuestLayout>)
}

export default Login