'use client';

import ScoreBar from '@/components/atoms/bars/ScoreBar';
import { Divider } from '@/components/atoms/divider';
import { CATEGORIES } from '@/constants/categories';
import { categoryColors } from '@/constants/colors';
import { useStore } from '@/store';
import { parseKlaciCode } from '@/utils/klaciCodeParser';
import { SummarySectionHeader } from './SummarySectionHeader';

const CompetencyDistSection = () => {
  const { selectedRegion, regionLoading } = useStore((state) => state.district);

  // KLACI 코드 파싱 예시 (selectedRegion에 klaci_code가 있다고 가정)
  const klaciCodeResult = selectedRegion?.klaci_code
    ? parseKlaciCode(selectedRegion.klaci_code)
    : [];

  // selectedRegion에서 점수 데이터를 가져와서 카테고리 데이터 생성
  const getCategoriesData = (): CategoryData[] => {
    if (!selectedRegion) {
      return []; // 기본값 반환
    }

    const score = {
      G: selectedRegion.growth_score ?? 0,
      S: selectedRegion.growth_score ?? 0, // S도 growth_score를 사용 (임시)
      T: selectedRegion.economy_score ?? 0,
      C: selectedRegion.economy_score ?? 0, // C도 economy_score를 사용 (임시)
      V: selectedRegion.living_score ?? 0,
      M: selectedRegion.living_score ?? 0, // M도 living_score를 사용 (임시)
      R: selectedRegion.safety_score ?? 0,
      A: selectedRegion.safety_score ?? 0, // A도 safety_score를 사용 (임시)
    };

    const categoryData: CategoryData[] = klaciCodeResult.map(
      ({ name, code, description }) => {
        return {
          title: name,
          code,
          color: categoryColors[name as keyof typeof categoryColors],
          score: score[code as keyof typeof score],
          description,
        };
      },
    );
    return categoryData;
  };

  const categories = getCategoriesData();

  // 로딩 중일 때는 기존 데이터를 유지하면서 로딩 표시
  if (regionLoading && !selectedRegion) {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {/* <PremiumContentTitle title={title} /> */}
          <SummarySectionHeader
            badgeLabel='ARCHETYPE BAR'
            title='역량 분포'
          />
          <div
            style={{
              background: '#FAFAFA',
              borderRadius: '42px',
              padding: '35px 30px',
              width: '100%',
              textAlign: 'center',
              color: '#666',
            }}
          >
            데이터를 불러오는 중...
          </div>
        </section>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {/* 타이틀 */}
        {/* <PremiumContentTitle title={title} /> */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <SummarySectionHeader
            badgeLabel='ARCHETYPE BAR'
            title='역량 분포'
          />
        </div>

        <Divider style={{ margin: '60px 0 0px' }} />


        {/* 카테고리 카드들 */}

        {categories.map((category, index) => (
          <CategoryCard key={index} category={category} index={index} categories={categories} />
        ))}

      </section>
    </div>
  );
};

interface CategoryCardProps {
  category: CategoryData;
  index: number;
  categories: CategoryData[];
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index, categories }) => {
  const { selectedRegion } = useStore((state) => state.district);

  const getItems = (
    index: number,
  ): {
    leftItem: string;
    rightItem: string;
  } => {
    if (index === 0) {
      return {
        leftItem: CATEGORIES.인구성장형,
        rightItem: CATEGORIES.인구정착형,
      };
    }
    if (index === 1) {
      return {
        leftItem: CATEGORIES.경제혁신형,
        rightItem: CATEGORIES.경제정속형,
      };
    }
    if (index === 2) {
      return {
        leftItem: CATEGORIES.생활역동형,
        rightItem: CATEGORIES.생활정체형,
      };
    }
    if (index === 3) {
      return {
        leftItem: CATEGORIES.안전회복형,
        rightItem: CATEGORIES.안전정진형,
      };
    }
    return {
      leftItem: '',
      rightItem: '',
    };
  };

  const { leftItem, rightItem } = getItems(index);

  // 지역의 실제 KLACI 코드를 파싱해서 해당 자리의 카테고리 확인
  const getRegionCategoryForIndex = (index: number): string | null => {
    if (!selectedRegion?.klaci_code) return null;

    try {
      const klaciCodeResult = parseKlaciCode(selectedRegion.klaci_code);
      return klaciCodeResult[index]?.name || null;
    } catch (error) {
      console.error('KLACI 코드 파싱 오류:', error);
      return null;
    }
  };

  const regionCategoryForThisIndex = getRegionCategoryForIndex(index);

  // 지역의 실제 카테고리에 따라 left 또는 right를 볼드 처리
  const getBoldItem = (): 'left' | 'right' | 'none' => {
    if (regionCategoryForThisIndex === leftItem) {
      return 'left';
    }
    if (regionCategoryForThisIndex === rightItem) {
      return 'right';
    }
    return 'none';
  };

  const isBold = getBoldItem();
  const isLastIndex = index === categories.length - 1;

  return (
    <div
      key={index}
      style={{
        // borderTop: isFirstIndex ? 'none' : '1px solid #D9D9E8',
        // padding: '30px',

      }}
    >
      {/* 바 컴포넌트 */}

      <div style={{ padding: '0 135px', marginTop: '80px' }}>
        <div
          style={{
            marginBottom: '60px',
          }}
        >
          <ScoreBar
            leftItem={leftItem}
            rightItem={rightItem}
            score={category.score}
            color={category.color}
            isBold={isBold}
            leftItemKeyColor={category.color}
          />
        </div>

        {/* 하단: description */}
        <div
          style={{
            fontSize: '1.1rem',
            lineHeight: '1.5',
            textAlign: 'justify',
            color: 'black',
          }}
        >
          {Array.isArray(category.description)
            ? category.description.map((paragraph, pIndex) => (
              <p key={pIndex} style={{ marginBottom: '0.75rem' }}>
                {paragraph}
              </p>
            ))
            : category.description}
        </div>

      </div>
      {!isLastIndex && <Divider style={{ margin: '80px 0 0' }} />}
    </div>
  );
};

interface CategoryData {
  title: string;
  color: string;
  description: string | string[];
  score: number;
}

export default CompetencyDistSection;
