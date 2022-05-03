import React, { useState } from 'react';

//Guage

import { arc } from "d3-shape"
import { scaleLinear } from "d3-scale"
import { format } from "d3-format"

const Gauge = (
  value=50,
  min=0,
  max=100,
  label,
  units,
) => {
  const backgroundArc = arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .cornerRadius(1)
    ()

  const percentScale = scaleLinear()
    .domain([min, max])
    .range([0, 1])
  const percent = percentScale(value)

  const angleScale = scaleLinear()
    .domain([0, 1])
    .range([-Math.PI / 2, Math.PI / 2])
    .clamp(true)

  const angle = angleScale(percent)

  const filledArc = arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(angle)
    .cornerRadius(1)
    ()

  const colorScale = scaleLinear()
    .domain([1,2,3,4,5])
    .range(['green','yellow','orange','red','maroon'])

  const gradientSteps = colorScale.ticks(10)
    .map(value => colorScale(value))

  const markerLocation = getCoordsOnArc(
    angle,
    1 - ((1 - 0.65) / 2),
  )

  return (
    <div
      style={{
        textAlign: "center",
      }}>
      <svg style={{overflow: "visible"}}
        width="9em"
        viewBox={[
          -1, -1,
          2, 1,
        ].join(" ")}>
        <defs>
          <linearGradient
            id="Gauge__gradient"
            gradientUnits="userSpaceOnUse"
            x1="-1"
            x2="1"
            y2="0">
            {gradientSteps.map((color, index) => (
              <stop
                key={color}
                stopColor={color}
                offset={`${
                  index
                  / (gradientSteps.length - 1)
                }`}
              />
            ))}
          </linearGradient>
        </defs>
        <path
          d={backgroundArc}
          fill="#dbdbe7"
        />
        <path
          d={filledArc}
          fill="url(#Gauge__gradient)"
        />
        <line
          y1="-1"
          y2="-0.65"
          stroke="white"
          strokeWidth="0.027"
        />
        <circle
          cx={markerLocation[0]}
          cy={markerLocation[1]}
          r="0.2"
          stroke="#2c3e50"
          strokeWidth="0.01"
          fill={colorScale(value)}
        />
        <path
          d="M0.136364 0.0290102C0.158279 -0.0096701 0.219156 -0.00967009 0.241071 0.0290102C0.297078 0.120023 0.375 0.263367 0.375 0.324801C0.375 0.422639 0.292208 0.5 0.1875 0.5C0.0852272 0.5 -1.8346e-08 0.422639 -9.79274e-09 0.324801C0.00243506 0.263367 0.0803571 0.120023 0.136364 0.0290102ZM0.1875 0.381684C0.221591 0.381684 0.248377 0.356655 0.248377 0.324801C0.248377 0.292947 0.221591 0.267918 0.1875 0.267918C0.153409 0.267918 0.126623 0.292947 0.126623 0.324801C0.126623 0.356655 0.155844 0.381684 0.1875 0.381684Z"
          transform={`rotate(${
            angle * (180 / Math.PI)
          }) translate(-0.2, -0.33)`}
          fill="grey"
        />
      </svg>

      <div style={{
        marginTop: "0.4em",
        fontSize: "3.5em",
        lineHeight: "1em",
        fontWeight: "300",
        fontFeatureSettings: "'zero', 'tnum' 1",
        color:'white'
      }}>
        { format(",")(value) }
      </div>

      {!!label && (
        <div style={{
          color: "white",
          marginTop: "0.6em",
          fontSize: "1.3em",
          lineHeight: "1.3em",
          fontWeight: "700",
        }}>
          { label }
        </div>
      )}

      {!!units && (
        <div style={{
          color: colorScale(value),
          lineHeight: "1.3em",
          fontWeight: "500",
        }}>
          { units }
        </div>
      )}
    </div>
  )
}

const getCoordsOnArc = (angle, offset=10) => [
  Math.cos(angle - (Math.PI / 2)) * offset,
  Math.sin(angle - (Math.PI / 2)) * offset,
]

//
const apiCity = {
  key: "70bcc63a5e3137e670a996c5cfe8b2a6",
  base: "http://api.openweathermap.org/geo/1.0/direct"
}

const apiStats = {
  key: "70bcc63a5e3137e670a996c5cfe8b2a6",
  base: "http://api.openweathermap.org/data/2.5/air_pollution"
}

function parseAQI(n){
   var result
   switch (n) {
     case 1:
       result = {
         color:'green',
         value:'Good',
         message:'Minimal impact'
       }
       break;
     case 2:
      result = {
        color:'yellow',
        value:'Fair',
        message:'May cause minor breathing discomfort to sensitive people.'
      }
       break;
     case 3:
      result = {
        color:'orange',
        value:'Moderate',
        message:'May cause breathing discomfort to people with lung disease such as asthma, and discomfort to people with heart disease, children and older adults.'
      }
       break;
      case 4:
        result = {
          color:'red',
          value:'Poor',
          message:'	May cause breathing discomfort to people on prolonged exposure, and discomfort to people with heart disease'
        }
       break;

      case 5:
        result = {
          color:'purple',
          value:'Very Poor',
          message:'May cause respiratory illness to the people on prolonged exposure. Effect may be more pronounced in people with lung and heart diseases.'
        }
        break
     default:
      result = {
        color:'grey',
        value:'',
        message:''
      }
       break;
   }
   return result
}
function parseO3(n){
  var result;
    let x = n/2;
    if(x<=60){
      result = {
        color: 'green',
        value :'Good',
        message:''
      }
    }
    else if(x>60 && x<=120){
      result = {
        color: 'yellow',
        value :'Moderate',
        message:''
      }
      
    }
    else if(x>120 && x<=180){
      result = {
        color: 'orange',
        value :'Caution',
        message:''
      }
    }
    else if(x>180 && x<=240){
      result = {
        color: 'red',
        value :'Caution',
        message:''
      }
    }
    else{
      result = {
        color: 'maroon',
        value :'Caution',
        message:''
      }
    }
  return result

}
function parseSO2(n){
  var result;
  let x = n/2.62;
  if(x<=35){
    result = {
      color: 'green',
      value :'Good',
      message:''
    }
  }
  else if(x>35 && x<=75){
    result = {
      color: 'yellow',
      value :'Moderate',
      message:''
    }
    
  }
  else if(x>75 && x<=185){
    result = {
      color: 'orange',
      value :'Caution',
      message:''
    }
  }
  else if(x>185 && x<=304){
    result = {
      color: 'red',
      value :'Caution',
      message:''
    }
  }
  else{
    result = {
      color: 'maroon',
      value :'Caution',
      message:''
    }
  }
return result
 
}
function parsePM(n){
  var result
    
     if(n<=15){
        result = {
          color: 'green',
          value :'Good',
          message:''
        }
      }else if(n>15 && n<=30){
        result = {
          color: 'yellow',
          value :'Fair',
          message:''
        }
      }else if(n>30 && n<=55){
        result = {
          color: 'orange',
          value :'Moderate',
          message:''
        }
      }else if(n>55 && n<=110){
        result = {
          color: 'red',
          value :'Poor',
          message:''
        }
      }else{
        result = {
          color: 'maroon',
          value :'Very poor',
          message:''
        }
      }

      return result;

}
function parseCO(n){
   var result
    var x = n/1000
     if(x<=9.4){
        result = {
          color: 'green',
          value :'Good',
          message:''
        }
      }
      else if(x>=9.5 && x<12.5){
        result = {
          color: 'yellow',
          value :'Moderate',
          message:''
        }
        
      }
      else if(x>=12.5 && x<=15.4){
        result = {
          color: 'orange',
          value :'Caution',
          message:''
        }
      }
      else if(x>=12.5 && x<=15.4){
        result = {
          color: 'red',
          value :'Caution',
          message:''
        }
      }
      else{
        result = {
          color: 'maroon',
          value :'Caution',
          message:''
        }
      }
      
   
   return result
}


function App() {
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState({});
  const [city, setCity] = useState({});
  var lat,lon
  

  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${apiCity.base}?q=${query}&limit=1&appid=${apiCity.key}`)
        .then(res => res.json())
        .then(result => {
          setCity(result[0]);
          lon = result[0].lon
          lat = result[0].lat
          setQuery('');
          fetch(`${apiStats.base}?lat=${lat}&lon=${lon}&appid=${apiStats.key}`)
          .then(res =>res.json())
          .then (result =>{
              setStats(result.list[0])
          })
            })
      
    }
  }
 
  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  return (
    <div className='App'>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {(typeof stats.main != "undefined") ? (
          <div>
        <div>
          <div className="location-box">
            <div className="location">{city.name}, {city.state}</div>
            <div className='country'>{city.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className='container'>
          <div className='air-box'>
            <div className='aqi-guage'>
              {Gauge(stats.main.aqi,0,5,"Air Quality Index",parseAQI(stats.main.aqi).value)}
              <div className='message'>{parseAQI(stats.main.aqi).message}.</div>
            </div>
            
            <div className='data-box'>
              <div className='info'>Pollutant Concentration(ug/m<sup>3</sup>)</div>
              <div className='data-row'>
                <div className='data-cell'>
                  <div className='data'>
                    <div className='val'>{stats.components.co}</div>
                    <div className='info'>CO</div>
                    <div className='value'>
                    <div className='indicator' id = {parseCO(stats.components.co).color}></div>
                    <div className='info' id ={'text-'+parseCO(stats.components.co).color} >{parseCO(stats.components.co).value}</div>
                    </div>
                  </div>
                </div>
                <div className='data-cell'>
                <div className='data'>
                    <div className='val'>{stats.components.o3}</div>
                    <div className='info'>O<sub>3</sub> </div>
                    <div className='value'>
                    <div className='indicator' id = {parseO3(stats.components.o3).color}></div>
                    <div className='info' id ={'text-'+parseO3(stats.components.o3).color} >{parseO3(stats.components.o3).value}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='data-row'>
                <div className='data-cell'>
                <div className='data'>
                    <div className='val'>{stats.components.so2}</div>
                    <div className='info'>SO<sub>2</sub></div>
                    <div className='value'>
                    <div className='indicator' id = {parseSO2(stats.components.so2).color}></div>
                    <div className='info' id ={'text-'+parseSO2(stats.components.so2).color} >{parseSO2(stats.components.so2).value}</div>
                    </div>
                  </div>
                </div>
                <div className='data-cell'>
                <div className='data'>
                    <div className='val'>{stats.components.pm2_5}</div>
                    <div className='info'>PM<sub>2.5</sub></div>
                    <div className='value'>
                    <div className='indicator' id = {parsePM(stats.components.pm2_5).color}></div>
                    <div className='info' id ={'text-'+parsePM(stats.components.pm2_5).color} >{parsePM(stats.components.pm2_5).value}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>
        ) : (
          <div className='empty'> 
            <div>
               <img src={require('./assets/search.png')} alt='1'></img>
              </div>
            <div className='error-message'>Search for a city in the search bar</div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
