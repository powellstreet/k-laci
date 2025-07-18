import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants/endpoints';
import {
  GetCategoryRanksParams,
  GetKlaciCodeRanksParams,
  GetMegaRegionRanksParams,
  GetProvinceRanksParams,
  GetRankingParams,
  GetRankingResponse,
  GetTopRegionsForCardParams,
  GetTopRegionsForCardResponse,
  // 기존 호환성을 위한 import
  GetTotalRegionRanksParams,
  GetTotalRegionRanksResponse,
} from '../types/stats.types';

export class StatsService {
  /**
   * 공통 ranking API 호출 메서드
   */
  private static async getRanking(
    endpoint: string,
    params:
      | GetRankingParams
      | GetMegaRegionRanksParams
      | GetKlaciCodeRanksParams
      | GetProvinceRanksParams
      | GetCategoryRanksParams = {},
  ): Promise<GetRankingResponse> {
    const { limit, year } = params;
    const type = 'type' in params ? params.type : undefined;
    const categoryId = 'categoryId' in params ? params.categoryId : undefined;

    const queryParams = new URLSearchParams();
    if (limit !== undefined) {
      queryParams.append('limit', limit.toString());
    }
    if (year !== undefined) {
      queryParams.append('year', year.toString());
    }
    if (type !== undefined) {
      queryParams.append('type', type);
    }
    if (categoryId !== undefined && categoryId !== null) {
      queryParams.append('categoryId', categoryId.toString());
    }

    const url = `${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return {
      data: response.data.data || [],
    };
  }

  /**
   * 전체 지역 순위 조회
   */
  static async getTotalRegionRanks(
    params: GetTotalRegionRanksParams = {},
  ): Promise<GetTotalRegionRanksResponse> {
    return this.getRanking(API_ENDPOINTS.STATS.TOTAL_RANKS, params);
  }

  /**
   * 주요 도시 순위 조회
   */
  static async getMajorProvincesRanks(
    params: GetRankingParams = {},
  ): Promise<GetRankingResponse> {
    return this.getRanking(API_ENDPOINTS.STATS.MAJOR_PROVINCES, params);
  }

  /**
   * 선택된 도시 순위 조회
   */
  static async getSelectedProvincesRanks(
    params: GetRankingParams = {},
  ): Promise<GetRankingResponse> {
    return this.getRanking(API_ENDPOINTS.STATS.SELECTED_PROVINCES, params);
  }

  /**
   * 경제자유구역 순위 조회
   */
  static async getFreeEconomyZoneRanks(
    params: GetRankingParams = {},
  ): Promise<GetRankingResponse> {
    return this.getRanking(API_ENDPOINTS.STATS.FREE_ECONOMY_ZONE, params);
  }

  /**
   * 성장촉진지역 순위 조회
   */
  static async getGrowthBoostZoneRanks(
    params: GetRankingParams = {},
  ): Promise<GetRankingResponse> {
    return this.getRanking(API_ENDPOINTS.STATS.GROWTH_BOOST_ZONE, params);
  }

  /**
   * 국가산업단지 순위 조회
   */
  static async getNationalIndustrialZoneRanks(
    params: GetRankingParams = {},
  ): Promise<GetRankingResponse> {
    return this.getRanking(
      API_ENDPOINTS.STATS.NATIONAL_INDUSTRIAL_ZONE,
      params,
    );
  }

  /**
   * 해안도시 순위 조회
   */
  static async getCostalCityRanks(
    params: GetRankingParams = {},
  ): Promise<GetRankingResponse> {
    return this.getRanking(API_ENDPOINTS.STATS.COSTAL_CITY, params);
  }

  /**
   * 메가 지역 순위 조회
   */
  static async getMegaRegionRanks(
    params: GetMegaRegionRanksParams = {},
  ): Promise<GetRankingResponse> {
    return this.getRanking(API_ENDPOINTS.STATS.MEGA_REGION, params);
  }

  /**
   * KLACI 코드 순위 조회
   */
  static async getKlaciCodeRanks(
    params: GetKlaciCodeRanksParams = {},
  ): Promise<GetRankingResponse> {
    return this.getRanking(API_ENDPOINTS.STATS.KLACI_CODE, params);
  }

  /**
   * 도 순위 조회
   */
  static async getProvinceRanks(
    params: GetProvinceRanksParams = {},
  ): Promise<GetRankingResponse> {
    return this.getRanking(API_ENDPOINTS.STATS.PROVINCE_RANK, params);
  }

  /**
   * 카테고리 순위 조회
   */
  static async getCategoryRanks(
    params: GetCategoryRanksParams = {},
  ): Promise<GetRankingResponse> {
    return this.getRanking(API_ENDPOINTS.STATS.CATEGORY_RANK, params);
  }

  /**
   * 지자체 타입 순위 조회
   */
  static async getDistrictTypeRanks(): Promise<GetRankingResponse> {
    return this.getRanking(API_ENDPOINTS.STATS.DISTRICT_TYPE_RANK, {});
  }

  /**
   * 상위 지역 카드용 데이터 조회
   */
  static async getTopRegionsForCard(
    params: GetTopRegionsForCardParams = {},
  ): Promise<GetTopRegionsForCardResponse> {
    const { limit } = params;
    const queryParams = new URLSearchParams();

    if (limit !== undefined) {
      queryParams.append('limit', limit.toString());
    }

    const url = `${API_ENDPOINTS.STATS.TOP_REGIONS_FOR_CARD}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await apiClient.get(url);

    return {
      data: response.data.data || [],
    };
  }
}

// 기존 호환성을 위한 인스턴스 export
export const statsService = new StatsService();

// Top Region Card 타입
export interface CategoryScore {
  growth_score: number;
  economy_score: number;
  living_score: number;
  safety_score: number;
}

export interface TopRegionCard {
  regionId: number;
  regionName: string;
  provinceName: string;
  rank: number;
  totalScore: number;
  klaciCode: string;
  klaciType: string;
  klaciNickname: string;
  categoryScore: CategoryScore;
}

// export interface GetTopRegionsForCardParams {
//   limit?: number;
// }

// export interface GetTopRegionsForCardResponse {
//   data: TopRegionCard[];
// }
