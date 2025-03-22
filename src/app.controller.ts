import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

// NestJS의 Controller 데코레이터를 사용하여 AppController 클래스를 정의합니다.
// 이 클래스는 HTTP 요청을 처리하는 컨트롤러 역할을 합니다.
@Controller()
export class AppController {
  // AppService를 의존성 주입(DI)으로 받아옵니다.
  constructor(private readonly appService: AppService) {}

  // HTTP GET 요청을 처리하는 메서드입니다.
  // 기본 경로('/')로 들어오는 요청을 처리하며, appService의 getHello 메서드 결과를 반환합니다.
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}

// 이 코드는 AppService의 메서드를 호출하여 클라이언트에게 응답을 반환하는 컨트롤러로 동작합니다.
