/**
 * Base de connaissances agricoles — Sénégal
 * Sources: ISRA, ANACIM, DAPSA, FAO, ANCAR, ARM, CSA
 * Dernière mise à jour: Campagne 2024-2025
 */

const KNOWLEDGE_BASE = {

  // ===== CALENDRIER CULTURAL PAR ZONE =====
  calendrier: {
    sahelienne: {
      description: "Zone sahélienne (Louga, Saint-Louis, Matam) — 200-500mm/an",
      hivernage: "Juillet à Septembre (court)",
      cultures_principales: "Mil souna, niébé, arachide hâtive, pastèque",
      calendrier: {
        "mai": "Préparation des sols, labour, achat semences certifiées",
        "juin": "Attente premières pluies utiles (>20mm), pré-positionnement intrants",
        "juillet": "Semis dès 1ère pluie utile, mil et arachide en priorité",
        "aout": "Sarclage, démariage, 1ère fertilisation urée sur mil",
        "septembre": "2ème sarclage, surveillance parasitaire, début récolte niébé",
        "octobre": "Récolte mil, récolte arachide, séchage",
        "novembre-avril": "Maraîchage irrigué si accès à l'eau (oignon, tomate)"
      }
    },
    soudanienne: {
      description: "Zone soudanienne (Kaolack, Fatick, Kaffrine, Tambacounda) — 500-1000mm/an",
      hivernage: "Juin à Octobre",
      cultures_principales: "Arachide, mil, maïs, sorgho, niébé, coton, pastèque",
      calendrier: {
        "mai": "Labour profond, application fumure de fond (phosphate)",
        "juin": "Semis arachide et mil dès pluies installées (cumul 30mm)",
        "juillet": "Semis maïs, 1er sarclage arachide, buttage",
        "aout": "Fertilisation azotée (urée), surveillance insectes",
        "septembre": "2ème sarclage, traitement phyto si nécessaire",
        "octobre": "Récolte arachide (90-120j), début récolte mil",
        "novembre": "Récolte maïs, battage, stockage",
        "decembre-mai": "Cultures de contre-saison, embouche bovine"
      }
    },
    casamancaise: {
      description: "Zone casamançaise (Ziguinchor, Kolda, Sédhiou) — 1000-1500mm/an",
      hivernage: "Mai à Novembre (long)",
      cultures_principales: "Riz pluvial, maïs, arachide, mil, manioc, anacarde",
      calendrier: {
        "mai-juin": "Défrichage, préparation rizières, semis riz pluvial précoce",
        "juillet": "Repiquage riz, semis maïs et arachide",
        "aout": "Entretien rizières, désherbage, gestion eau",
        "septembre": "Fertilisation riz, surveillance blast et borers",
        "octobre": "Début récolte riz précoce, récolte arachide",
        "novembre": "Récolte riz tardif, séchage, battage",
        "decembre-avril": "Arboriculture (mangue, anacarde), maraîchage"
      }
    },
    fleuve: {
      description: "Vallée du fleuve (Saint-Louis, Matam, Podor) — riz irrigué",
      saisons: "2 campagnes/an : hivernale (juillet-décembre) et contre-saison chaude (février-juin)",
      cultures_principales: "Riz irrigué, tomate industrielle, oignon",
      calendrier: {
        "fevrier": "Préparation contre-saison chaude, pépinières riz",
        "mars": "Repiquage riz contre-saison, irrigation",
        "avril-mai": "Entretien riz, récolte tomate industrielle",
        "juin": "Récolte riz contre-saison chaude",
        "juillet": "Pépinières campagne hivernale",
        "aout": "Repiquage riz hivernage",
        "septembre-octobre": "Entretien, fertilisation",
        "novembre-decembre": "Récolte riz hivernage (rendement 5-8 t/ha)",
        "janvier": "Récolte oignon, préparation prochaine campagne"
      }
    }
  },

  // ===== CULTURES DETAILLEES =====
  cultures: {
    arachide: {
      nom: "Arachide (Arachis hypogaea)",
      importance: "1ère culture de rente du Sénégal, 40% des terres cultivées",
      production_nationale: "1.8 million tonnes (2024), principalement bassin arachidier",
      varietes: {
        "55-437": { cycle: 90, zone: "sahélienne, nord bassin arachidier", rendement: "1.5-2 t/ha", usage: "huilerie" },
        "Fleur 11": { cycle: 95, zone: "bassin arachidier nord", rendement: "1.8-2.2 t/ha", usage: "huilerie, résistante sécheresse" },
        "73-33": { cycle: 105, zone: "soudanienne, sud bassin", rendement: "2-2.5 t/ha", usage: "bouche/confiserie" },
        "GC 8-35": { cycle: 110, zone: "Casamance, sud", rendement: "2.2-3 t/ha", usage: "huilerie haut rendement" },
        "Sunu Gaal": { cycle: 90, zone: "toutes zones", rendement: "2-2.5 t/ha", usage: "nouvelle variété ISRA 2022" }
      },
      semis: {
        densite: "Écartement 50cm × 15cm, 1 graine/poquet",
        dose_semence: "80-100 kg/ha de gousses, ou 60 kg/ha de graines décortiquées",
        profondeur: "3-5 cm",
        condition: "Semer après une pluie de 20mm minimum, sol humide sur 10cm"
      },
      fertilisation: {
        fumure_fond: "150 kg/ha de 6-20-10 (NPK) au semis",
        phosphate: "100-150 kg/ha de phosphate naturel de Thiès (Taïba)",
        chaulage: "200-300 kg/ha de dolomie si sol acide (pH<5.5)"
      },
      maladies: {
        "cercosporiose": "Taches brunes sur feuilles. Traitement: mancozèbe 2.5 kg/ha",
        "rosette": "Virus transmis par pucerons. Variétés résistantes + lutte anti-pucerons",
        "aflatoxines": "Moisissure post-récolte. Séchage rapide à <8% humidité",
        "termites": "Traitement semences au thiamethoxam ou fipronil"
      },
      recolte: "Quand 80% des gousses sont mûres (intérieur foncé), arracher, retourner, sécher 3-5 jours"
    },
    mil: {
      nom: "Mil souna (Pennisetum glaucum)",
      importance: "Céréale de base au Sénégal, 1.2 M ha cultivés",
      production_nationale: "950 000 tonnes (2024)",
      varietes: {
        "Souna 3": { cycle: 90, zone: "sahélienne", rendement: "1.5-2 t/ha" },
        "Thialack 2": { cycle: 85, zone: "sahélienne/soudanienne", rendement: "1.8-2.2 t/ha" },
        "IBV 8004": { cycle: 75, zone: "sahélienne (très précoce)", rendement: "1.2-1.5 t/ha" },
        "ISMI 9507": { cycle: 95, zone: "soudanienne", rendement: "2-2.5 t/ha" }
      },
      semis: {
        densite: "Poquets 90×90cm, 5-7 graines/poquet, démariage à 3 plants",
        dose_semence: "5-7 kg/ha",
        condition: "1ère pluie utile de 20mm, ressemer si levée <50%"
      },
      fertilisation: {
        nPK: "150 kg/ha de 15-15-15 au semis",
        uree: "50 kg/ha d'urée au tallage (25-30 jours après semis)",
        fumier: "5 tonnes/ha de fumier bien décomposé (recommandé)"
      },
      maladies: {
        "charbon": "Épis déformés noirâtres. Traitement semences apron star",
        "foreur_tige": "Chenille dans la tige. Traitement précoce au deltaméthrine",
        "mildiou": "Feuilles blanchâtres. Variétés résistantes ISRA",
        "oiseaux": "Phase maturation. Gardiennage, épouvantails, filets"
      }
    },
    riz: {
      nom: "Riz (Oryza sativa / Oryza glaberrima)",
      importance: "Sénégal importe 70% de son riz. Autosuffisance = priorité nationale",
      production_nationale: "1.2 million tonnes paddy (2024), objectif 1.6M en 2025",
      systemes: {
        "irrigue_fleuve": "Vallée du Sénégal, 2 récoltes/an, 5-8 t/ha, variétés Sahel 108/202",
        "pluvial_casamance": "Basse et Moyenne Casamance, 1 récolte, 2-4 t/ha, NERICA",
        "bas_fonds": "Zones humides Kolda/Sédhiou, 1 récolte, 3-5 t/ha"
      },
      varietes: {
        "Sahel 108": { cycle: 125, zone: "fleuve irrigué", rendement: "6-8 t/ha", type: "irrigué" },
        "Sahel 202": { cycle: 130, zone: "fleuve irrigué", rendement: "7-9 t/ha", type: "irrigué" },
        "NERICA 4": { cycle: 90, zone: "Casamance pluvial", rendement: "3-4 t/ha", type: "pluvial" },
        "ISRIZ 12": { cycle: 110, zone: "fleuve/Anambé", rendement: "5-7 t/ha", type: "irrigué" },
        "WAR 77": { cycle: 120, zone: "bas-fonds", rendement: "3-5 t/ha", type: "pluvial" }
      },
      fertilisation_irriguee: {
        fond: "200 kg/ha DAP au repiquage",
        couverture_1: "150 kg/ha urée au tallage (21 jours)",
        couverture_2: "100 kg/ha urée à l'initiation paniculaire (50 jours)"
      }
    },
    mais: {
      nom: "Maïs (Zea mays)",
      production_nationale: "450 000 tonnes (2024)",
      varietes: {
        "Early Thai": { cycle: 75, zone: "toutes", rendement: "2-3 t/ha" },
        "Synthetic C": { cycle: 90, zone: "soudanienne", rendement: "3-4 t/ha" },
        "JDB": { cycle: 100, zone: "Casamance", rendement: "3.5-4.5 t/ha" },
        "SWAN": { cycle: 85, zone: "soudanienne/Casamance", rendement: "3-4.5 t/ha" }
      },
      fertilisation: {
        nPK: "200 kg/ha 15-15-15 au semis",
        uree: "100 kg/ha urée fractionnée (50kg à 30j, 50kg à 50j)"
      }
    },
    tomate: {
      nom: "Tomate (Solanum lycopersicum)",
      zones: "Niayes (Dakar-Thiès), Fleuve, périmètres irrigués",
      saison: "Contre-saison (novembre à mai) en irrigué",
      production_nationale: "200 000 tonnes (2024)",
      varietes: {
        "Xina": { cycle: 85, usage: "marché frais + transformation", rendement: "25-35 t/ha" },
        "Mongal F1": { cycle: 80, usage: "marché frais", rendement: "30-40 t/ha" },
        "Tropimech": { cycle: 90, usage: "transformation, résistante", rendement: "20-30 t/ha" },
        "Roma VF": { cycle: 85, usage: "transformation", rendement: "25-30 t/ha" }
      },
      problemes_courants: {
        "Tuta absoluta": "Mineuse, dégâts feuilles et fruits. Pièges à phéromones + Bt",
        "mouche_blanche": "Vecteur virus TYLCV. Filets insect-proof + imidacloprid",
        "mildiou": "Par temps humide. Bouillie bordelaise préventive",
        "nematodes": "Galles sur racines. Rotation 3 ans, solarisation, variétés résistantes",
        "flétrissement_bactérien": "Ralstonia. Aucun traitement chimique. Rotation obligatoire"
      }
    },
    oignon: {
      nom: "Oignon (Allium cepa)",
      zones: "Niayes, Fleuve, Louga",
      importance: "2ème culture maraîchère, production 400 000 t/an",
      varietes: {
        "Violet de Galmi": "Référence. Cycle 150j, conservation 3-4 mois, 25-35 t/ha",
        "Safari": "Hybride F1, gros bulbes, 30-40 t/ha mais coût semences élevé",
        "Orient F1": "Bon rendement zones chaudes, conservation moyenne"
      },
      calendrier: "Pépinière septembre-octobre, repiquage novembre, récolte mars-avril",
      stockage: "Séchage 7-10j au champ, claies ventilées, température fraîche, pertes moyennes 20-30%"
    },
    niebe: {
      nom: "Niébé (Vigna unguiculata)",
      importance: "Légumineuse majeure, fixe l'azote, bon en rotation après céréale",
      varietes: {
        "Melakh": { cycle: 60, zone: "sahélienne", rendement: "1-1.5 t/ha" },
        "Mouride": { cycle: 65, zone: "sahélienne/soudanienne", rendement: "1.2-1.8 t/ha" },
        "Yacine": { cycle: 70, zone: "soudanienne", rendement: "1.5-2 t/ha" }
      },
      avantages: "Tolère sécheresse, enrichit le sol en azote, cycle court, bonne valeur marchande"
    }
  },

  // ===== SOLS ET FERTILITE =====
  sols: {
    types: {
      "Dior": "Sol sablonneux du bassin arachidier. Pauvre en MO. Bon pour arachide/mil si amendé",
      "Deck": "Sol argilo-sableux. Plus fertile. Bon pour maïs, sorgho, riz pluvial",
      "Deck-Dior": "Intermédiaire. Polyvalent",
      "Hollaldé": "Sol argileux lourd de la vallée du fleuve. Excellent pour riz irrigué",
      "Fondé": "Sol de berge du fleuve. Très fertile. Cultures maraîchères",
      "Latéritique": "Sol ferrugineux. Casamance/sud. Bon avec amendement organique"
    },
    conseils: {
      amelioration: "Apport matière organique (fumier 5-10 t/ha), rotation légumineuses, compostage",
      analyse: "Faire analyser son sol au laboratoire ISRA ou LNRPV tous les 3 ans",
      pH: "pH optimal 5.5-6.5 pour la plupart des cultures. Chaulage si pH<5"
    }
  },

  // ===== PROTECTION DES CULTURES =====
  protection: {
    bio: {
      "neem": "Azadirachta indica. Macération feuilles 1kg/10L, 24h. Contre pucerons, chenilles, criquets",
      "savon_noir": "50g/L eau + 10ml huile végétale. Contre pucerons, cochenilles, mouches blanches",
      "piment_ail": "200g piment + 100g ail broyés dans 5L eau, filtrer. Répulsif général",
      "cendre": "Saupoudrer autour des plants. Contre limaces, escargots, certains insectes",
      "Bt": "Bacillus thuringiensis. Contre chenilles (noctuelles, foreurs). Bio et sélectif",
      "trichoderma": "Champignon antagoniste. Contre fusariose, pythium. Traitement sol"
    },
    chimique: {
      "deltaméthrine": "Insecticide polyvalent. Pucerons, chenilles, coléoptères. 0.5-1 L/ha",
      "mancozèbe": "Fongicide préventif. Mildiou, cercosporiose. 2-2.5 kg/ha",
      "glyphosate": "Herbicide total. Uniquement avant semis ou en inter-rang avec cache",
      "imidacloprid": "Insecticide systémique. Mouches blanches, pucerons. Traitement semences"
    },
    lutte_integree: "Combiner : variétés résistantes + rotation + bio-pesticides + chimique en dernier recours"
  },

  // ===== INFORMATIONS ECONOMIQUES =====
  economie: {
    prix_intrants_2025: {
      "NPK 15-15-15": "18 000 FCFA/sac 50kg (subventionné)",
      "Urée 46%": "16 000 FCFA/sac 50kg (subventionné)",
      "DAP": "20 000 FCFA/sac 50kg",
      "Semences arachide certifiées": "500 FCFA/kg",
      "Semences mil certifiées": "1 000 FCFA/kg",
      "Semences riz certifiées": "350 FCFA/kg"
    },
    subventions: "L'État subventionne les engrais à 50% via le programme de subvention des intrants (campagne 2024-2025). Retrait aux points de vente agréés avec carte d'agriculteur.",
    credits: {
      "CNCAS": "Crédit Agricole. Taux 7.5%. Campagne et équipement",
      "LBA": "La Banque Agricole (ex-CNCAS). Prêts aux GIE et coopératives",
      "DER": "Délégation à l'Entrepreneuriat Rapide. Financement jeunes/femmes"
    },
    circuits_vente: "Marché local (louma), bana-bana (intermédiaires), SONACOS (arachide), CSS (riz), export via coopératives"
  },

  // ===== CHANGEMENT CLIMATIQUE =====
  climat: {
    tendances: "Décalage saison des pluies de 2-3 semaines vs années 80. Événements extrêmes plus fréquents. Températures +1.5°C en 40 ans.",
    adaptation: {
      "varietes_courtes": "Utiliser des variétés à cycle court (75-90 jours) pour s'adapter à l'hivernage raccourci",
      "semis_echelonne": "Ne pas tout semer le même jour. Étaler sur 2-3 semaines pour réduire le risque",
      "zaï": "Technique de micro-bassins pour capter l'eau en zone sahélienne",
      "demi_lunes": "Ouvrages anti-érosifs pour récupérer l'eau de ruissellement",
      "agroforesterie": "Arbres dans les champs (Faidherbia albida) : ombre, azote, fourrage",
      "RNA": "Régénération Naturelle Assistée — protéger les repousses d'arbres dans les champs"
    }
  },

  // ===== SAISON EN COURS (MAI 2025) =====
  saison_actuelle: {
    mois: "Mai 2025",
    phase: "Pré-hivernage — préparation de la campagne 2025",
    conseils_immediats: [
      "Acheter vos semences certifiées MAINTENANT (disponibilité limitée en juin)",
      "Faire le labour de préparation avant les premières pluies",
      "Vérifier vos stocks d'engrais, retirer votre dotation subventionnée",
      "Nettoyer le matériel agricole (semoir, houe sine)",
      "Préparer les fosses fumières pour le compost",
      "Planifier la rotation : ne pas remettre arachide après arachide"
    ],
    previsions_hivernage_2025: "ANACIM prévoit un hivernage normal à excédentaire pour 2025. Installation probable des pluies fin juin au sud, mi-juillet au nord."
  }
};

module.exports = { KNOWLEDGE_BASE };
