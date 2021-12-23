function Chevron(props) {
    return(
        <svg
            className={props.className}
            height={props.height}
            width={props.width}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 5.978 9.746"
        >
            <path id="패스_6629" data-name="패스 6629" d="M0,4.533,4.167,0,8.333,4.533" transform="translate(5.239 0.706) rotate(90)" 
            fill='none' stroke={props.color} strokeLinecap="round" strokeWidth="1"/>
        </svg>
    );
}

export default Chevron;