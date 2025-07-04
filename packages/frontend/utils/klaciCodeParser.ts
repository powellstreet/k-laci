interface KlaciCodeItem {
  code: string | undefined;
  name: string;
  position: number;
  description: string;
}

type KlaciCodeResult = KlaciCodeItem[];

// 유효한 KLACI 코드 문자들
type ValidKlaciCode = 'S' | 'G' | 'T' | 'C' | 'V' | 'M' | 'R' | 'A';

export function parseKlaciCode(klaciCode: string): KlaciCodeResult {
  // 소문자를 대문자로 변환
  const upperCode = klaciCode.toUpperCase();

  // 4자리가 아닌 경우 에러 처리
  if (upperCode.length !== 4) {
    throw new Error('KLACI 코드는 4자리여야 합니다.');
  }

  // 유효한 코드인지 검증
  const validCodes: ValidKlaciCode[] = ['S', 'G', 'T', 'C', 'V', 'M', 'R', 'A'];
  for (let i = 0; i < 4; i++) {
    if (!validCodes.includes(upperCode[i] as ValidKlaciCode)) {
      throw new Error(`유효하지 않은 KLACI 코드 문자입니다: ${upperCode[i]}`);
    }
  }

  const result: KlaciCodeResult = [];

  // 각 자리별로 의미 매핑 (순서 보장)
  const codeMappings: KlaciCodeItem[] = [
    {
      position: 0,
      code: upperCode[0],
      name: upperCode[0] === 'G' ? '인구성장형' : '인구정착형',
      description: paragraphs[upperCode[0] as ValidKlaciCode],
    },
    {
      position: 1,
      code: upperCode[1],
      name: upperCode[1] === 'T' ? '경제혁신형' : '경제정속형',
      description: paragraphs[upperCode[1] as ValidKlaciCode],
    },
    {
      position: 2,
      code: upperCode[2],
      name: upperCode[2] === 'V' ? '생활역동형' : '생활정체형',
      description: paragraphs[upperCode[2] as ValidKlaciCode],
    },
    {
      position: 3,
      code: upperCode[3],
      name: upperCode[3] === 'R' ? '안전회복형' : '안전정진형',
      description: paragraphs[upperCode[3] as ValidKlaciCode],
    },
  ];

  result.push(...codeMappings);

  return result;
}

const paragraphs: Record<ValidKlaciCode, string> = {
  S: '인구정착형 지역은 인구 유출이 유입보다 많거나 인구 증가세가 둔화되어, 인구 구조가 안정기에 접어든 성숙 단계의 지역을 의미합니다. 이들 지역은 전출 인구가 많고 혼인율과 출산율이 낮아 자연적 인구 감소가 나타나며, 평균 연령이 높고 고령화가 빠르게 진행되는 경향이 있습니다. 경제활동인구와 청년층이 줄어들면서 지역 활력이 저하될 우려도 있습니다. 그러나 오랜 기간 형성된 안정된 공동체와 성숙한 사회적 자본, 기존 인프라의 효율적 활용 등은 기회가 될 수 있습니다. 고령층 친화 환경 조성, 실버산업, 평생교육, 은퇴 인력 활용, 귀농·귀촌 등 특화 전략을 통해 질적 성장과 새로운 가치 창출이 가능합니다. 한편, 인구 감소와 고령화로 인한 지역경제 위축, 복지·의료 서비스 수요 증가, 빈집 문제 등 도전 과제도 큽니다. 청년층 유치, 고령층 지원 정책, 지역 활력 유지 등 다각적인 대응이 필요하며, 인구정착형 지역은 쇠퇴가 아닌 특화된 안정과 전환의 기회를 찾아야 합니다.',
  G: '인구성장형 지역은 인구 유입과 자연적·사회적 인구 증가 잠재력이 크다는 점이 특징입니다. 이 지역들은 청년층의 순유입이 높고, 혼인 건수와 출산율이 상대적으로 높아 인구 구조의 지속가능성이 큽니다. 젊은 인구와 경제활동인구가 많아 지역 경제에 활력을 불어넣으며, 외국인 유입도 활발해 다문화적 환경이 조성되고 있습니다. 이러한 특성은 풍부한 노동력과 확대되는 소비 시장, 혁신 촉진 등 지역 경제 성장의 기회로 이어집니다. 지자체가 청년 친화 정책과 교육·보육 지원을 강화하면 인구 유입과 정착을 더욱 촉진할 수 있습니다. 다양한 인구 유입은 지역 문화와 서비스 산업의 발전에도 긍정적 영향을 미칩니다. 하지만 인구 급증에 따른 주택·교통·공공서비스 수요 증가, 사회적 통합 문제 등 새로운 도전도 발생합니다. 청년층의 기대에 부응하는 양질의 일자리와 생활기반 마련이 중요하며, 인구성장형 지역은 성장의 부작용을 관리하고 질적 발전을 도모해야 지속적인 발전이 가능합니다.',
  T: "경제혁신형은 GRDP, 벤처기업 수 등 경제 역동성 관련 지표가 우수하여, 혁신을 기반으로 한 미래 성장 잠재력이 큰 지역을 의미합니다. 이들 지역은 높은 재정자립도를 바탕으로 다수의 상장기업과 벤처기업이 활동하며, 풍부한 특허와 높은 청년고용률을 통해 양질의 일자리를 창출하는 등 경제 전반에 활력이 넘칩니다. 이러한 혁신 기반과 재정적 여력은 R&D 인프라에 재투자되거나 산학연 협력을 통한 기술 클러스터를 조성하여 고부가가치 산업을 창출하는 핵심 기회로 작용합니다. 한편, 빠른 기술 변화에 대한 지속적인 대응이 필요하며, 혁신의 혜택이 소수에게 집중되는 불균형 문제나 주거비 상승, 기존 산업의 위축 등 성장 이면의 과제에도 직면합니다. 따라서 경제 발전과 생활 안정의 균형을 맞추는 포용적 정책을 통해, 끊임없이 변화에 적응하고 미래 가치를 만들어내는 '학습하는 경제 시스템'으로 나아가는 것이 중요합니다.",
  C: "경제정속형은 혁신 관련 지표와 재정자립도가 낮고 사업체 수가 적어, 전반적인 경제 활력이 부족하고 점진적 쇠퇴 위험에 직면한 지역을 의미합니다. 이들 지역은 낮은 GRDP와 취약한 산업 기반으로 인해 양질의 일자리가 부족하며, 낮은 재정자립도와 혁신 동력 부재로 경제적 지속성에 어려움을 겪는 경향이 있습니다. 그러나 이러한 위기는 오히려 지역의 현실에 맞는 주력 산업을 강화하거나 유휴 자원을 활용해 새로운 틈새를 발굴하고, 공동체 기반의 사회적 경제 모델을 육성하는 기회가 될 수 있습니다. 한편, 산업 구조 다변화에 실패할 경우 인재 유출 심화와 외부 충격에 대한 취약성으로 지역 경제가 소멸 수준의 침체를 겪을 수 있습니다. 따라서 현상 유지가 아닌 '생존을 위한 혁신'을 목표로, 지역 경제의 체질을 근본적으로 개선하려는 선제적이고 전략적인 접근이 필요히 요구됩니다.",
  V: "생활역동형은 교통, 보육, 교육, 문화 등 생활 기반 시설이 잘 갖춰져 있어 주민의 삶의 질과 편의성이 높은, 생동감 넘치는 지역을 의미합니다. 이들 지역은 편리한 교통망과 풍부한 교육·문화 인프라를 바탕으로 다양한 계층의 인구를 유인하는 높은 정주 매력도를 지니며, 이는 서비스 산업 발전의 토대가 됩니다. '살기 좋은 도시'라는 강력한 브랜드는 창의적 인재를 육성하고 유치하는 기반이 되며, 워케이션이나 체류형 관광 등 새로운 수요를 창출할 기회를 제공합니다. 한편, 높은 인기로 인해 주택 가격 등 생활비가 상승하여 주거 불안정을 야기할 수 있으며, 생활 인프라가 특정 지역에 편중되어 지역 내 발전 격차가 심화될 우려가 있습니다. 따라서 양적 팽창을 넘어, 모든 주민이 혜택을 누릴 수 있도록 포용성과 지속가능성을 고려하여 생활 기반과 지역 경제의 선순환 구조를 강화하는 노력이 중요합니다.",
  M: '생활정체형은 교통·문화·교육 등 생활 기반이 전반적으로 취약하고, 특히 빈집·노후주택 문제로 주거 환경이 열악하여 인구 유출 가능성이 큰 지역을 의미합니다. 이들 지역은 높은 주거 불안정성과 절대적으로 부족한 생활 편의시설, 외부와의 교류 단절 등으로 인해 지역 공동화와 쇠퇴가 심화되는 경향을 보입니다. 그러나 이러한 위기는 오히려 대규모 도시재생 사업을 추진하거나, 버려진 빈집을 청년 창업 공간 등으로 활용하여 지역에 새로운 기능을 부여하는 기회가 될 수 있습니다. 한편, 가장 시급한 주거 환경 개선과 최소한의 생활 인프라 확보에 실패할 경우, 지역의 고립은 더욱 심해져 소멸을 피하기 어렵습니다. 따라서 쇠퇴라는 현실을 직시하고, 전면적인 환경 개선과 외부와의 연결성 강화를 통해 소멸 방지를 넘어 새로운 가치를 창출하려는 혁신적 노력이 요구됩니다.',
  R: "안전회복형은 주민의 건강 수준이 높고 물리적·사회적 안전망이 튼튼하며, 쾌적한 환경을 바탕으로 위기 상황에서의 회복탄력성이 뛰어난 지역을 의미합니다. 또한 우수한 의료·복지 시스템과 높은 녹지율, 활발한 시민사회를 기반으로 주민들이 신체적·정신적으로 건강하고 안전한 삶을 영위합니다. 높은 삶의 질은 모든 연령대의 인구 유치에 유리한 자산으로 작용하며, 이를 바탕으로 예방 중심의 선진적 보건·안전 시스템을 선도하는 발전 모델을 구축할 기회를 갖습니다. 한편, 기후변화나 신종 감염병 등 예측 불가능한 미래 위험에 선제적으로 대응해야 하며, 높은 선호도로 인한 인구 밀집과 자원 압박 심화 가능성도 관리해야 합니다. 따라서 현재 수준에 안주하지 않고, 모든 주민이 혜택을 누리는 포용성을 강화하며 미래 변화에 유연하게 대처하는 '학습하고 진화하는 시스템'을 만드는 것이 중요합니다.",
  A: '안전정진형은 건강, 안전, 복지, 환경 등 전반적인 안전 및 회복 관련 지표가 낮아, 주민 삶의 질 개선과 회복탄력성 강화를 위한 집중적인 노력이 필요한 지역을 의미합니다. 이들 지역은 높은 사망률과 자살률, 부족한 의료·복지 시설, 열악한 환경 등 복합적인 문제를 안고 있으며, 이러한 취약점들이 상호작용하며 악순환을 형성하는 경향이 있습니다. 그러나 명확하게 드러난 문제들은 오히려 정책적 자원을 집중시켜야 할 영역을 알려주며, 위기 극복 과정에서 혁신적인 사회 서비스를 도입하고 공동체 협력을 강화하는 기회가 될 수 있습니다. 한편, 제한된 재원 하에 다양한 문제들의 우선순위를 정하고, 단편적 대응이 아닌 경제·생활 등 다른 영역과 연계한 종합적인 해결책을 모색해야 하는 과제가 있습니다. 따라서 전략적 우선순위에 따라 공공 인프라를 강화하고 주민 참여 기반의 안전망을 구축하여 지속가능한 개선을 이뤄내는 것이 중요합니다.',
};
