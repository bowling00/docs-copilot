import http from '@/utils/http';
export const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

interface githubAuthDto {
  code: string;
}

export const getGithubUser = (
  params: githubAuthDto
): Promise<{
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}> =>
  http({
    url: '/auth/github',
    method: 'post',
    data: params,
  });
