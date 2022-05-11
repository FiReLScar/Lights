import net from 'net'
import colorsys from 'colorsys'

let HEX = {r: 0, g: 0, b: 0}

let client = new net.Socket()
let Send = data => client.connect(1337, "127.0.0.1", () => client.write(data))
let ChangeColorHSV = (h, s, v) => Send(`Color: ${h},${s},${v}`)
let ChangeColorRGB = (r, g, b) => {
  HEX = {r: r, g: g, b: b}
  let HSV = colorsys.rgb_to_hsv({r: r, g: g, b: b})
  Send(`Color: ${HSV.h},${HSV.s},${HSV.v}`)
}
let SetStatus = status => Send(status)

export default function handler(req, res) {
  let { value } = req.query
  if (value === 'off') SetStatus('Off')
  else if (value === 'on') SetStatus('On')
  else if (value === 'color') {
    let { r, g, b } = req.query
    if (r && g && b) ChangeColorRGB(r, g, b)
    else {
      res.status(200).json({color: colorsys.rgb_to_hex(HEX.r, HEX.g, HEX.b)})
      return
    }
  } else {
    res.status(400).send("Please provide a valid value")
    return
  }
  res.status(200).send("Done")
}