function ClockIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 20 20">
            <path id="circle" d="M232,44a8,8,0,1,1-8,8,8.009,8.009,0,0,1,8-8m0-2a10,10,0,1,0,10,10,10,10,0,0,0-10-10Z" transform="translate(-222 -42)" fill="rgba(0,0,0,0.36)"/>
            <path id="패스_839" data-name="패스 839" d="M235.224,55.579a1,1,0,0,1-.632-.225l-3.158-2.58a1,1,0,0,1-.367-.774V47a1,1,0,0,1,2,0v4.527l2.791,2.28a1,1,0,0,1-.634,1.774Z" transform="translate(-222 -41.767)" fill={props.color}/>
        </svg>
    );
}

export default ClockIcon;