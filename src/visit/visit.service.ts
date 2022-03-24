import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Visit} from "@src/entities/visit";
import {Repository} from "typeorm";
import {Response} from 'express';
import {v4} from "uuid";
import {DateService} from "@src/date/date.service";
import {DashBoardInput} from "@src/hit/input/hit.input";
import {ExternalService} from "@src/externalApi/external.service";
import {VisitInput} from "@src/visit/input/visit.input";
import {ONE_DAY} from "@utils/constant";
import {TEN_MINUTE} from "cores/constant";
import faker from "faker";

interface ReverseGeoLocation {
  name: string
  code: { id: string, type: string, mappingId: string },
  region: {
    area0: { name: string, coords: any },
    area1: { name: string, coords: any, alias: string },
    area2: { name: string, coords: any },
    area3: { name: string, coords: any },
    area4: { name: string, coords: any }
  }

}

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit) private visitRepository: Repository<Visit>,
    private readonly dateService: DateService,
    private readonly externalService: ExternalService
  ) {
  }

  async getVisitDashboard(data: DashBoardInput) {
    const {before, after}: { before: Date, after: Date } = this.dateService.calculateDate(data.frequency);

    const result = await this.visitRepository
      .createQueryBuilder('visit')
      .andWhere("visit.created_at >= :before", {before})
      .andWhere("visit.created_at < :after", {after})
      .orderBy("visit.created_at", "DESC")
      .getMany();


    return result;

  }

  async createVisit(res: Response, data: VisitInput) {
    const visitIdentifier = res.req.cookies['visit_identifier'];
    const now = new Date();
    const kst = new Date(now.setHours(now.getHours() + 9));

    if (visitIdentifier) {
      const recentDate = await this.visitRepository
        .createQueryBuilder('visit')
        .select()
        .where("identifier = :identifier", {identifier: visitIdentifier})
        .getOne();

      const diff = ((kst as any) - (recentDate.updatedAt as any)) / TEN_MINUTE;
      
      if (diff >= 1) {
        const updateResult = await this.visitRepository
          .createQueryBuilder("visit")
          .update()
          .set({
            count: () => 'count + 1'
          })
          .where("identifier = :identifier", {identifier: visitIdentifier})
          .execute();

        return updateResult.affected;
      }
      return;
    }

    const identifier = v4();

    const geolocation: ReverseGeoLocation = await this.externalService.reverseGeolocation(data);

    const insertResult = await this.visitRepository
      .createQueryBuilder('visit')
      .insert()
      .values({
        identifier: identifier,
        country: geolocation.region.area0.name,
        city: geolocation.region.area1.name,
        regionName: geolocation.region.area2.name,
        regionAddress: geolocation.region.area3.name
      })
      .execute();

    res.cookie('visit_identifier', identifier, {maxAge: ONE_DAY, httpOnly: true});

    return insertResult.identifiers[0].id;
  }

  async onApplicationBootstrap(){
    if(process.env.NODE_ENV==="production"){
      return
    }
    for(let i=0;i<15;i++){
      await this.visitRepository
        .createQueryBuilder()
        .insert()
        .values({
          identifier: faker.random.uuid(),
          country: "kr",
          city: "서울특별시",
          regionName: "123123",
          regionAddress: "12123"
          }
        )
        .execute()

      await this.visitRepository
        .createQueryBuilder()
        .insert()
        .values({
            identifier: faker.random.uuid(),
            country: "kr",
            city: "부산광역시",
            regionName: "123123",
            regionAddress: "12123"
          }
        )
        .execute()
    }
  }

}