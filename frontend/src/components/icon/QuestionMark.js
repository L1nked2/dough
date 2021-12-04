function QuestionMarkIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 12 12">
            <g id="타원_279" data-name="타원 279" fill="#fff" stroke={props.color} stroke-width="0.7">
                <circle cx="6" cy="6" r="6" stroke="none"/>
                <circle cx="6" cy="6" r="5.65" fill="none"/>
            </g>
            <text id="_" data-name="?" transform="translate(4 9)" fill={props.color} font-size="8" font-family="SpoqaRegular" font-weight="500"><tspan x="0" y="0">?</tspan></text>
        </svg>
    );
}

export default QuestionMarkIcon;