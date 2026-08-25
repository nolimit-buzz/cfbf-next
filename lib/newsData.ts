export interface NewsArticle {
  id: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  image: string;
  readTime: string;
  themes: string[];
  keyContext: string;
  paragraphs: {
    type: 'p' | 'h2' | 'blockquote' | 'image';
    text: string;
    caption?: string;
    url?: string;
  }[];
}

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    tag: "Fund Updates",
    date: "December 12, 2025",
    readTime: "4 min read",
    themes: ["LOCAL CURRENCY", "MINI-GRIDS", "CROSS RIVER"],
    keyContext: "CFBF's fifth transaction backs four solar hybrid mini-grids in Cross River State, set to electrify 3,600 households and businesses.",
    title: "Climate Finance Blending Facility Enables Local Currency Financing for CEESOLAR's Off-Grid Energy Project in Cross River State",
    excerpt: "CFBF's fifth transaction backs four solar hybrid mini-grids in Cross River State, set to electrify 3,600 households and businesses.",
    author: "Climate Finance Blending Facility",
    authorAvatar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=100&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
    paragraphs: [
      {
        type: 'p',
        text: "The Climate Finance Blending Facility (CFBF), a catalytic first-loss multi-donor co-financing facility for off-grid clean energy projects in Nigeria, has mobilized long-term local currency financing for CEESOLAR Energy Limited's renewable energy initiative in Cross River State. This represents the fifth transaction supported by the facility, which operates with £10 million in concessional capital from the UK Foreign, Commonwealth & Development Office (FCDO), supplemented by US$10 million from British International Investment (BII) and a US$20 million counter-guarantee facility."
      },
      {
        type: 'p',
        text: "The initiative will construct and commission four isolated solar hybrid mini-grids with a combined capacity of 760 kWp across underserved communities. Upon completion, these installations are projected to electrify approximately 3,600 households and small businesses, generate an estimated 561 jobs, and prevent over 737 tonnes of annual CO₂ emissions. The project aligns with Nigeria's universal electrification agenda and supports Sustainable Development Goal 7."
      },
      {
        type: 'p',
        text: "Earlier projects financed through the CFBF have deployed approximately ₦9 billion across four developers — Darway, Hotspot, ACOB, and Prado — reaching over 25,000 beneficiaries, creating more than 2,300 jobs, and installing approximately 1.7 MW of capacity. The facility has generated a pipeline of approximately ₦243.31 billion across 23 developers."
      },
      {
        type: 'h2',
        text: "Construction Finance Warehouse Facility"
      },
      {
        type: 'p',
        text: "The CEESOLAR transaction benefited from InfraCredit's Construction Finance Warehouse Facility (CFWF), funded by the Nigeria Sovereign Investment Authority (NSIA), which provides short-term bridge financing to address construction-period liquidity gaps — demonstrating InfraCredit's integrated, end-to-end approach to unlocking capital for sustainable infrastructure projects."
      },
      {
        type: 'p',
        text: "The CFBF combines subordinated first-loss capital from FCDO and development partners with technical assistance from FSD Africa and InfraCredit's 'AAA'-rated guarantees to mobilize long-term domestic institutional capital for distributed renewable energy. The transaction also reflects a strategic partnership between InfraCredit and the Africa Minigrid Developers Association (AMDA), improving access to long-term domestic financing for member developers."
      },
      {
        type: 'blockquote',
        text: "\"We are delighted that the UK-funded Climate Finance Blending Facility continues to catalyse local currency debt for renewable energy infrastructure.\" — Jonny Baxter, UK Deputy High Commissioner in Lagos"
      },
      {
        type: 'blockquote',
        text: "\"This milestone reflects CEESOLAR's commitment to bridging Nigeria's energy gap through innovation and collaboration.\" — Chibueze Ekeh, CEO of CEESOLAR Energy Limited"
      },
      {
        type: 'p',
        text: "InfraCredit CEO Chinua Azubike noted that \"this transaction demonstrates the power of partnership — combining catalytic first-loss capital,\" while AMDA CEO Olamide Niyi-Afuye commented that \"this milestone underscores the growing confidence in the capacity of AMDA's members to scale.\""
      },
      {
        type: 'p',
        text: "The project is registered under the World Bank's Distributed Access through Renewable Energy Scale-up (DARES) Performance-Based Grant Programme, administered by the Rural Electrification Agency (REA). InfraCredit and REA signed a Memorandum of Understanding in August 2022 to address long-term financing bottlenecks for off-grid operators."
      },
      {
        type: 'h2',
        text: "About CEESOLAR"
      },
      {
        type: 'p',
        text: "CEESOLAR Energy Limited is a renewable energy company providing energy access through decentralized energy systems since 2017. The company has installed 729.5kWp of capacity across mini-grid and stand-alone installations, with over 695 connections across multiple Nigerian states."
      }
    ]
  },
  {
    id: "2",
    tag: "Fund Updates",
    date: "January 26, 2026",
    readTime: "4 min read",
    themes: ["MESH GRID", "LOCAL CURRENCY", "PARTNERSHIP"],
    keyContext: "CFBF's sixth transaction — and first mesh-grid project — backs First Electric's 20 mesh-grid networks across three states.",
    title: "Climate Finance Blending Facility Supports Local Currency Financing for First Electric's Off-Grid Energy Project in Nigeria",
    excerpt: "CFBF's sixth transaction — and first mesh-grid project — backs First Electric's 20 mesh-grid networks across three states.",
    author: "Climate Finance Blending Facility",
    authorAvatar: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=100&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop",
    paragraphs: [
      {
        type: 'p',
        text: "The Climate Finance Blending Facility (CFBF), a catalytic first-loss, multi-donor co-financing mechanism for off-grid clean energy initiatives in Nigeria, has facilitated long-term local currency financing for First Electric Power and Automation Services Limited. This represents the sixth transaction under the program and marks the inaugural mesh-grid infrastructure project supported by CFBF."
      },
      {
        type: 'p',
        text: "The initiative encompasses 20 mesh-grid electricity networks totaling 724.8 kWp of capacity across Gombe, Nasarawa, and Ondo States. Upon completion, the project is projected to provide electricity to approximately 5,156 households and businesses, generate roughly 616 jobs, and reduce annual carbon emissions by 762 tonnes."
      },
      {
        type: 'p',
        text: "Previous CFBF projects have deployed approximately ₦12 billion across five developers, reaching over 28,000 beneficiaries and establishing approximately 1.8 MW of off-grid solar capacity. The facility's current pipeline encompasses ₦243.31 billion across 23 developers."
      },
      {
        type: 'h2',
        text: "Construction Finance Warehouse Facility"
      },
      {
        type: 'p',
        text: "First Electric also received support from InfraCredit's Construction Finance Warehouse Facility, funded by the Nigeria Sovereign Investment Authority, which provided temporary liquidity during the construction phase before long-term refinancing."
      },
      {
        type: 'blockquote',
        text: "\"This transaction marks the Facility's first investment in innovative mesh grid projects, designed to lower the cost of distributed renewable energy solutions for rural and remote communities.\" — UK Deputy High Commissioner"
      },
      {
        type: 'p',
        text: "InfraCredit CEO Chinua Azubike said the guarantee represents \"the Facility's first investment in mesh-grid infrastructure and underscores the scale and maturity the platform has now achieved\" in financing distributed renewable energy across Nigeria. First Electric CEO Daniel Komolafe emphasized the company's commitment to \"bridging Nigeria's energy gap through innovation and collaboration,\" demonstrating that clean energy solutions can be commercially viable and sustainable. AMDA CEO Olamide Niyi-Afuye added that the transaction \"demonstrates the transformative power of strategic partnerships in advancing energy access\" and provides a blueprint for scaling distributed renewable energy across Africa."
      },
      {
        type: 'p',
        text: "The project is registered under the World Bank's Distributed Access through Renewable Energy Scale-up (DARES) Performance-Based Grant Programme. Technical and due diligence costs received support from FSD Africa through a Technical Assistance Agreement aimed at reducing barriers for first-time issuers."
      },
      {
        type: 'h2',
        text: "About the Organizations"
      },
      {
        type: 'p',
        text: "Climate Finance Blending Facility: Capitalized with $21.3 million in concessional funding from the UK Foreign, Commonwealth & Development Office and British International Investment, the facility mobilizes capital through first-loss risk sharing alongside InfraCredit's local currency guarantees."
      },
      {
        type: 'p',
        text: "First Electric: Incorporated in 2019, this Nigerian renewable energy company designs, develops, and operates mesh-grids, microgrids, and stand-alone solar systems for rural communities, currently operating approximately 250 active Energy-as-a-Service connections across Lagos, Abuja, and Ondo States."
      },
      {
        type: 'p',
        text: "InfraCredit: Established in 2017 as a specialized local currency infrastructure credit guarantee institution, InfraCredit holds 'AAA'(NG) ratings and supports long-term local currency infrastructure financing in Nigeria through guarantees that attract domestic institutional capital."
      }
    ]
  },
  {
    id: "3",
    tag: "Impact Report",
    date: "October 05, 2025",
    readTime: "7 min read",
    themes: ["ESG", "SDGS", "COMMUNITIES"],
    keyContext: "A deep dive into our verified environmental and social metrics from the 2025 Impact Report.",
    title: "Annual Impact Report: Bridging the Energy Gap and Fostering Sustainable Economic Growth in Nigeria",
    excerpt: "A close look at how clean energy installations have impacted 2.4 million lives, created 300+ green jobs, and reduced carbon emissions.",
    author: "Amina Bello",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1200&auto=format&fit=crop",
    paragraphs: [
      {
        type: 'p',
        text: "Our 2025 Annual Sustainability and Impact Report has been officially released, highlighting key achievements in greenhouse gas reduction, clean energy access, and rural economic empowerment across our blended finance portfolio."
      },
      {
        type: 'h2',
        text: "Empowering Rural Livelihoods"
      },
      {
        type: 'p',
        text: "By de-risking solar developers, we have facilitated the installation of over 32 MW of renewable capacity, directly impacting 2.4 million lives. Rural communities that previously relied on toxic diesel generators now enjoy 24/7 reliable power, boosting micro-business yields and reducing local emissions."
      },
      {
        type: 'blockquote',
        text: "Our impact goes beyond metrics: we are witnessing the structural transformation of rural economies through clean energy."
      },
      {
        type: 'p',
        text: "In addition to carbon reduction, the projects have catalyzed the creation of over 300 direct green jobs, with a specific focus on training female engineers and micro-entrepreneurs to manage local grid systems."
      },
      {
        type: 'image',
        url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1200&auto=format&fit=crop",
        text: "Community members benefited by solar installation.",
        caption: "Access to clean electricity supports local education and healthcare clinics."
      },
      {
        type: 'h2',
        text: "Verifiable Environmental Outcomes"
      },
      {
        type: 'p',
        text: "All carbon metrics have been independently audited and verified in compliance with the Climate Bonds Standard, resulting in a reduction of 611k tonnes of CO2 emissions annually, proving that financial de-risking can drive massive, verifiable climate outcomes."
      }
    ]
  },
  {
    id: "4",
    tag: "Industry News",
    date: "September 18, 2025",
    readTime: "6 min read",
    themes: ["POLICY", "REGULATION", "GREEN BONDS"],
    keyContext: "Understanding the evolving legal landscape that is facilitating the growth of green finance.",
    title: "Navigating the New Regulatory Frameworks Supporting Green Bonds and Climate Finance in Nigeria",
    excerpt: "Recent policy updates from the SEC and Central Bank are creating a more robust enabling environment for sustainable investments.",
    author: "Dr. Emmanuel Nwachukwu",
    authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=1200&auto=format&fit=crop",
    paragraphs: [
      {
        type: 'p',
        text: "The regulatory landscape for climate finance in Nigeria is maturing rapidly. Recent guidelines issued by the Securities and Exchange Commission (SEC) and the Central Bank of Nigeria (CBN) are providing much-needed clarity and standardization for green bonds and sustainable investment funds."
      },
      {
        type: 'h2',
        text: "Standardization and Taxonomy"
      },
      {
        type: 'p',
        text: "One of the most significant developments is the move towards a unified green taxonomy. By clearly defining what constitutes a 'green' or 'climate-aligned' investment, regulators are mitigating the risk of greenwashing and providing institutional investors with the confidence they need to allocate capital."
      },
      {
        type: 'p',
        text: "These frameworks align closely with international standards, such as the ICMA Green Bond Principles and the Climate Bonds Initiative standards, ensuring that Nigerian green financial instruments are globally competitive and credible."
      },
      {
        type: 'image',
        url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1200&auto=format&fit=crop",
        text: "Legal books and document folders.",
        caption: "Clear regulatory frameworks are essential for scaling climate finance."
      },
      {
        type: 'h2',
        text: "Incentivizing Green Capital"
      },
      {
        type: 'p',
        text: "Beyond standardization, there are ongoing discussions regarding potential incentives for green investments. These could include favorable capital charge treatments for banks holding green bonds or tax exemptions for returns generated from certified sustainable funds."
      },
      {
        type: 'blockquote',
        text: "A robust regulatory framework is the invisible infrastructure that allows green capital to flow freely and securely."
      },
      {
        type: 'p',
        text: "While some of these incentives are still in the proposal stage, the direction of travel is clear. Policymakers recognize that mobilizing private capital is essential to meeting Nigeria's Nationally Determined Contributions (NDCs) under the Paris Agreement."
      },
      {
        type: 'h2',
        text: "Implications for Fund Managers"
      },
      {
        type: 'p',
        text: "For vehicles like the Climate Finance Blending Facility, these regulatory advancements are highly positive. They validate our stringent ESG reporting processes and our commitment to third-party verification (such as our CBI certification). As the market becomes more regulated, funds with established, transparent track records will be best positioned to attract institutional capital."
      }
    ]
  },
  {
    id: "5",
    tag: "Market Insights",
    date: "August 14, 2025",
    readTime: "6 min read",
    themes: ["CAPITAL", "MINI-GRIDS", "PARTNERSHIP"],
    keyContext: "How first-loss concessional tranches bridge early-stage developer risk profiles.",
    title: "Unlocking Capital for Mini-Grids in Rural Communities",
    excerpt: "FCDO and InfraCredit partnership demonstrates how first-loss capital bridges equity gaps for remote developers.",
    author: "Tunde Johnson",
    authorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1200&auto=format&fit=crop",
    paragraphs: [
      {
        type: 'p',
        text: "Bridging the capital gap for rural solar developers requires strategic collaboration. Commercial banks and typical debt investors avoid early-stage mini-grid installations due to perceived performance risk and long payback cycles."
      },
      {
        type: 'h2',
        text: "Concessional Blending at Work"
      },
      {
        type: 'p',
        text: "To bridge this gap, the partnership between the UK Foreign, Commonwealth & Development Office (FCDO) and InfraCredit leverages first-loss concessional funding. By placing FCDO seed capital in a subordinated position, the facility de-risks the capital stack, enabling institutional pension capital to step in as senior lenders."
      },
      {
        type: 'blockquote',
        text: "Subordinated, concessional capital is the key that unlocks long-term commercial credit for clean energy developers."
      },
      {
        type: 'p',
        text: "This framework has successfully mobilized private capital at a 1:4 leverage ratio, showing that every Naira of first-loss capital can draw in four Naira of domestic pension fund financing."
      },
      {
        type: 'image',
        url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
        text: "Rural solar mini-grid installation site.",
        caption: "Financing local infrastructure in local currency removes exchange rate shocks."
      },
      {
        type: 'h2',
        text: "Creating Investment-Grade Assets"
      },
      {
        type: 'p',
        text: "By packaging these guarantees, the Facility creates investment-grade debt options from high-risk off-grid projects. This makes green bonds an attractive asset class for conservative pension administrators, establishing a sustainable, long-term funding stream."
      }
    ]
  }
];
