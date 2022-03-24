import {Injectable} from "@nestjs/common";
import {DashBoardFrequency} from "@src/hit/input/hit.input";

@Injectable()
export class DateService {

  calculateDate(frequency: string): { before: Date, after: Date } {

    switch (frequency) {
      case DashBoardFrequency.ONE_DAY:
        return getDateRange(0, 1);
      case DashBoardFrequency.SEVEN_DAY:
        return getDateRange(0, 7);
      case DashBoardFrequency.FIFTEEN_DAY:
        return getDateRange(0, 15);
      case DashBoardFrequency.ONE_MONTH:
        return getDateRange(1, 0);
      case DashBoardFrequency.THREE_MONTH:
        return getDateRange(3, 0);
      case DashBoardFrequency.SIX_MONTH:
        return getDateRange(6, 0);
      default:
        return;
    }

    function getDateRange(minusMonth: number, minusDate: number) {
      const now = new Date();

      const diffUtcAndKst = now.getTimezoneOffset() * 60 * 1000;

      const diffHour = now.getTimezoneOffset() / 60;

      const kstTime = new Date(now.getTime() - diffUtcAndKst);

      const before = new Date(
        kstTime.getFullYear(),
        kstTime.getMonth() - minusMonth,
        kstTime.getDate() - minusDate,
        0 - diffHour,
        0,
        0
      );

      const after = new Date(
        kstTime.getFullYear(),
        kstTime.getMonth(),
        kstTime.getDate()+1,
        0 - diffHour,
        0,
        0
      );


      return {before, after};
    }
  }
}