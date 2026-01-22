const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'League Stats API',
      version: '1.0.0',
      description: 'REST API for League of Legends player statistics and match data. The Riot Games API key is automatically handled server-side from environment variables - no API key input required.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5005',
        description: 'Development server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            code: {
              type: 'string',
              description: 'Error code',
            },
          },
        },
        NotFoundError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Summoner not found',
            },
            code: {
              type: 'string',
              example: 'NOT_FOUND',
            },
          },
        },
        Summoner: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Encrypted summoner ID',
            },
            puuid: {
              type: 'string',
              description: 'Player UUID',
            },
            accountId: {
              type: 'string',
              description: 'Account ID',
            },
            name: {
              type: 'string',
              description: 'Summoner name',
            },
            profileIconId: {
              type: 'number',
              description: 'Profile icon ID',
            },
            revisionDate: {
              type: 'number',
              description: 'Revision date timestamp',
            },
            summonerLevel: {
              type: 'number',
              description: 'Summoner level',
            },
          },
        },
        LeagueEntry: {
          type: 'object',
          properties: {
            leagueId: {
              type: 'string',
            },
            queueType: {
              type: 'string',
              example: 'RANKED_SOLO_5x5',
            },
            tier: {
              type: 'string',
              example: 'GOLD',
            },
            rank: {
              type: 'string',
              example: 'II',
            },
            summonerId: {
              type: 'string',
            },
            summonerName: {
              type: 'string',
            },
            leaguePoints: {
              type: 'number',
            },
            wins: {
              type: 'number',
            },
            losses: {
              type: 'number',
            },
            veteran: {
              type: 'boolean',
            },
            inactive: {
              type: 'boolean',
            },
            freshBlood: {
              type: 'boolean',
            },
            hotStreak: {
              type: 'boolean',
            },
          },
        },
        ChampionMastery: {
          type: 'object',
          properties: {
            championId: {
              type: 'number',
            },
            championLevel: {
              type: 'number',
            },
            championPoints: {
              type: 'number',
            },
            lastPlayTime: {
              type: 'number',
            },
            championPointsSinceLastLevel: {
              type: 'number',
            },
            championPointsUntilNextLevel: {
              type: 'number',
            },
            chestGranted: {
              type: 'boolean',
            },
            tokensEarned: {
              type: 'number',
            },
            summonerId: {
              type: 'string',
            },
          },
        },
        MatchParticipant: {
          type: 'object',
          properties: {
            puuid: {
              type: 'string',
            },
            championName: {
              type: 'string',
            },
            kills: {
              type: 'number',
            },
            deaths: {
              type: 'number',
            },
            assists: {
              type: 'number',
            },
            win: {
              type: 'boolean',
            },
            teamId: {
              type: 'number',
            },
            lane: {
              type: 'string',
            },
            totalMinionsKilled: {
              type: 'number',
            },
            riotIdGameName: {
              type: 'string',
            },
          },
        },
        Match: {
          type: 'object',
          properties: {
            metadata: {
              type: 'object',
              properties: {
                matchId: {
                  type: 'string',
                },
                participants: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
            info: {
              type: 'object',
              properties: {
                gameMode: {
                  type: 'string',
                },
                queueId: {
                  type: 'number',
                },
                participants: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/MatchParticipant',
                  },
                },
                teams: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      teamId: {
                        type: 'number',
                      },
                      win: {
                        type: 'boolean',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        PlayerStats: {
          type: 'object',
          properties: {
            puuid: {
              type: 'string',
            },
            matchesRequested: {
              type: 'number',
            },
            matchesAnalyzed: {
              type: 'number',
            },
            wins: {
              type: 'number',
            },
            losses: {
              type: 'number',
            },
            winRate: {
              type: 'number',
            },
            avgKills: {
              type: 'number',
            },
            avgDeaths: {
              type: 'number',
            },
            avgAssists: {
              type: 'number',
            },
            topChampions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  championName: {
                    type: 'string',
                  },
                  games: {
                    type: 'number',
                  },
                  wins: {
                    type: 'number',
                  },
                  winRate: {
                    type: 'number',
                  },
                  kills: {
                    type: 'number',
                  },
                  deaths: {
                    type: 'number',
                  },
                  assists: {
                    type: 'number',
                  },
                },
              },
            },
            failedMatches: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        PaginationMetadata: {
          type: 'object',
          properties: {
            hasMore: {
              type: 'boolean',
              description: 'Whether more matches are available',
            },
            nextStartIndex: {
              type: 'number',
              description: 'Next start index for pagination',
            },
            totalLoaded: {
              type: 'number',
              description: 'Total number of matches loaded',
            },
            retryAfter: {
              type: 'number',
              nullable: true,
              description: 'Seconds to wait before next request (if rate limited)',
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundError',
              },
            },
          },
        },
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./server.js'], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

