function MenuIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 18 18">
            <path id="패스_862" data-name="패스 862" d="M60,3H49a2.006,2.006,0,0,0-2,2V19a2.006,2.006,0,0,0,2,2H63a2.006,2.006,0,0,0,2-2V8Zm3,16H49V5H59V9h4Z" transform="translate(-47 -3)" fill={props.color}/>
            <rect id="사각형_213" data-name="사각형 213" width="10" height="2" rx="1" transform="translate(4 12)" fill={props.color}/>
            <rect id="사각형_214" data-name="사각형 214" width="5" height="2" rx="1" transform="translate(4 4)" fill={props.color}/>
            <rect id="사각형_215" data-name="사각형 215" width="10" height="2" rx="1" transform="translate(4 8)" fill={props.color}/>
        </svg>
    );
}

export default MenuIcon;