/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsArray, IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class YearData {
  @IsNumber() // 'years' 필드는 숫자여야 함
  years: number

  @IsNumber() // 'value' 필드는 숫자여야 함
  value: number
}

export class CreateChartDto {
  @IsArray() // 배열이어야 함
  @ValidateNested({ each: true }) // 배열의 각 요소가 'YearData' 객체여야 함
  @Type(() => YearData) // 'years'를 'YearData' 클래스 인스턴스로 변환
  years?: YearData[] // 연도 데이터

  @IsString() // 문자열이어야 함
  chartType: string // 차트 유형

  @IsArray() // 배열이어야 함
  targetDataKeys: string[] // 대상 데이터 키 배열

  @IsOptional() // 선택적 필드 (값이 없어도 유효)
  @IsArray() // 배열이어야 함
  colorSet?: string[] // 색상 세트 배열

  @IsOptional() // 선택적 필드 (값이 없어도 유효)
  @IsArray() // 배열이어야 함
  labels?: string[] // 레이블 배열

  @IsOptional() // 선택적 필드 (값이 없어도 유효)
  @IsNumber() // 숫자여야 함
  order?: number // 순서

  @IsOptional() // 선택적 필드 (값이 없어도 유효)
  @IsArray() // 배열이어야 함
  units?: string[] // 단위 배열

  @IsOptional() // 선택적 필드 (값이 없어도 유효)
  @IsString() // 문자열이어야 함
  title?: string // 차트 제목

  @IsString() // 문자열이어야 함
  category: string // 차트 카테고리
}
