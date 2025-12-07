import { Image, StyleSheet, Text, View } from "react-native"

const Menu = ({id,image_url,name})=>{

    return (<View style={style.card} onTouchStart={()=>{
        
    }}>
        <Image></Image>
        <Text></Text>
    </View>)
}

const style = StyleSheet.create({
    card:{
        borderWidth:"5px",
        borderRadius:"15px"
    }
})

export default Menu