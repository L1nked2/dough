function Triangle () {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="41.5" height="38" viewBox="0 0 41.5 38">
            <defs>
                <filter id="다각형_1" x="0" y="0" width="41.5" height="38" filterUnits="userSpaceOnUse">
                <feOffset dy="1" input="SourceAlpha"/>
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feFlood floodOpacity="0.161"/>
                <feComposite operator="in" in2="blur"/>
                <feComposite in="SourceGraphic"/>
                </filter>
            </defs>
            <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#다각형_1)">
                <path id="다각형_1-2" data-name="다각형 1" d="M8.75,0,17.5,14H0Z" transform="translate(12 11)" fill="#fff"/>
            </g>
        </svg>
    );
}

export default Triangle;