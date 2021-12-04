function LocationIcon(props) {
    return(
      <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 11.2 11.2">
        <path id="패스_892" data-name="패스 892" d="M183.5,2A5.5,5.5,0,1,0,189,7.5,5.5,5.5,0,0,0,183.5,2Zm.55,9.862V11.3a.55.55,0,0,0-1.1,0v.557a4.4,4.4,0,0,1-3.812-3.812h.558a.55.55,0,1,0,0-1.1h-.558a4.4,4.4,0,0,1,3.812-3.812V3.7a.55.55,0,0,0,1.1,0V3.138a4.405,4.405,0,0,1,3.812,3.812H187.3a.55.55,0,1,0,0,1.1h.557A4.405,4.405,0,0,1,184.05,11.862Z" transform="translate(-177.9 -1.9)" fill={props.color} stroke="#fff" stroke-width="0.2"/>
      </svg>
    );
  }

export default LocationIcon;