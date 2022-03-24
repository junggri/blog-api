import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {google} from "googleapis";
import axios from "axios";
import {YoutubeInput} from "@src/entities/Youtube";

@Injectable()
export class GoogleService {
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  async getVisitor() {
    return new Promise((resolve, reject) => {
      const jwtClient = new google.auth.JWT(
        this.configService.get("GA_CLIENT_EMAIL"),
        null,
        this.configService.get("GA_PRIVATE_KEY"),
        ["https://www.googleapis.com/auth/analytics.readonly"],
        null
      )

      jwtClient.authorize((err, token) => {
        if (err) {
          console.error(err)
          return
        }
        const analytics = google.analytics("v3");
        queryData(analytics)
      })

      const queryData = (analytics) => {
        analytics.data.ga.get({
          "auth": jwtClient,
          "ids": this.configService.get("GA_VIEW_ID"),
          "start-date": "2021-01-05",
          "end-date": "today",
          "dimensions": "ga:date",
          "metrics": "ga:users,ga:sessions"
        }, (err, res) => {
          if (err) {
            console.error(err);
            return;
          }
          resolve(JSON.stringify(res.data, null, 4));
        })
      }
    })
  }

  async getVideos(input: YoutubeInput) {
    const urlParams = input.nextPageToken ? `&pageToken=${input.nextPageToken}` : "";
    const accessParams = `&key=${this.configService.get("GOOGLE_DATA_API")}`;
    const baseURI = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=PLwaHjBUqDBdsjeOb7ymADH_epvhIWhdba&maxResults=20";

    const {data} = await axios.get(
      baseURI + urlParams + accessParams,
      {
        headers: {'Accept': 'application/json'}
      });


    const ids = data.items.map((e, i) => {
      if (i === 0) {
        return e.contentDetails.videoId;
      } else {
        return "2C" + e.contentDetails.videoId;
      }
    });


    const videos = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${ids.join("%")}&key=${this.configService.get("GOOGLE_DATA_API")}`,
      {
        headers: {'Accept': 'application/json'}
      });

    return {nextPageToken: data.nextPageToken, data: JSON.stringify(videos.data.items)};
  }

}