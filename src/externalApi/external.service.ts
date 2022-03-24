import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import axios from "axios";
import {VisitInput} from "@src/visit/input/visit.input";
import crypto from "crypto-js";
import request from "request";

interface SMS {
  name: string
  content: string
  title?: string
}

@Injectable()
export class ExternalService {
  constructor(
    private configService: ConfigService
  ) {
  }


  // async geolocation() {
  //   const {data: {ip}} = await axios("https://api.ipify.org?format=json");
  //   console.log(ip)
  //   // const rawData = ip.replace(/[\(\{|\)\}\;]/g, "").split(":");
  //
  //   const host = 'https://geolocation.apigw.ntruss.com';
  //   const url = `/geolocation/v2/geoLocation?ip=106.101.0.243&responseFormatType=json`;
  //   const method = 'GET';
  //   const timestamp = Date.now().toString();
  //   const secretKey = this.configService.get("API_SECRETKEY");
  //   const accessKey = this.configService.get("API_ACCESSKEY")
  //   const space = " ";
  //   const newLine = "\n";
  //
  //   const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  //
  //   hmac.update(method);
  //   hmac.update(space);
  //   hmac.update(url);
  //   hmac.update(newLine);
  //   hmac.update(timestamp);
  //   hmac.update(newLine);
  //   hmac.update(accessKey);
  //
  //   const hash = hmac.finalize();
  //
  //   try {
  //     const {data} = await axios.get(host + url, {
  //       headers: {
  //         "Content-type": "application/json; charset=utf-8",
  //         'x-ncp-apigw-timestamp': timestamp,
  //         'x-ncp-iam-access-key': accessKey,
  //         'x-ncp-apigw-signature-v2': hash.toString(CryptoJS.enc.Base64)
  //       }
  //     });
  //
  //     return data
  //
  //   } catch (e) {
  //     console.error(e);
  //     throw new Error('방문자 생성에 실패하엿습니다.')
  //   }
  // }

  async reverseGeolocation(data: VisitInput) {
    const baseUrl = 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc'
    const coordParmeter = `?coords=${data.lon},${data.lat}`
    const outputParameter = '&output=json'
    const addressParameter = '&orders=admcode'

    const requestUrl = baseUrl + coordParmeter + outputParameter + addressParameter;

    try {
      const {data: {results: [result]}} = await axios.get(requestUrl, {
        headers: {
          "Content-type": "application/json; charset=utf-8",
          'X-NCP-APIGW-API-KEY-ID': 'mrx34o7uuz',
          'X-NCP-APIGW-API-KEY': 'ySzZxWqUsRTsKO7NqDJU8qHu8bt4BYDc3Z7SH7VL'
        }
      })

      return result;
    } catch (e) {
      console.error(e);
    }
  }


  async sendSMS(data: SMS) {


    const date = Date.now().toString();
    const uri = this.configService.get("API_URI");
    const secretKey = this.configService.get("API_SECRETKEY");
    const accessKey = this.configService.get("API_ACCESSKEY");
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
    const url2 = `/sms/v2/services/${uri}/messages`;
    const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, secretKey);

    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);

    const hash = hmac.finalize();
    const signature = hash.toString(crypto.enc.Base64);

    request({
      method: method,
      json: true,
      uri: url,
      headers: {
        "content-type": "application/json",
        "x-ncp-iam-access-key": accessKey,
        "x-ncp-apigw-timestamp": date,
        "x-ncp-apigw-signature-v2": signature,
      },
      body: {
        type: "SMS",
        countryCode: "82",
        from: this.configService.get("API_PHONE"),
        content: data.title ? `${data.name}님께서 ${data.title}글에 댓글을 남기셨습니다.` : `${data.name}님께서 ${data.content}라고 메시지를 메시지를 보냈습니다.`,
        messages: [
          {
            to: this.configService.get("API_PHONE")
          }
        ]
      }
    }, (err, res, html) => {
      if (err) {
        console.error(err);
      } else {
        // const resultCode = 200;
        console.log(html);
        return true;
      }
    });
  }
}