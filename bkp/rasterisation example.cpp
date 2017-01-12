#include <stddef.h>
#include <limits.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>

#define SCREEN_HEIGHT 22
#define SCREEN_WIDTH  78

// Simulated frame buffer
char Screen[SCREEN_HEIGHT][SCREEN_WIDTH];

void SetPixel(long x, long y, char color)
{
  if ((x < 0) || (x >= SCREEN_WIDTH) ||
      (y < 0) || (y >= SCREEN_HEIGHT))
  {
    return;
  }

  Screen[y][x] = color;
}

void Visualize(void)
{
  long x, y;

  for (y = 0; y < SCREEN_HEIGHT; y++)
  {
    for (x = 0; x < SCREEN_WIDTH; x++)
    {
      printf("%c", Screen[y][x]);
    }

    printf("\n");
  }
}

typedef struct
{
  long x, y;
  unsigned char color;
} Point2D;


// min X and max X for every horizontal line within the triangle
long ContourX[SCREEN_HEIGHT][2];

#define ABS(x) ((x >= 0) ? x : -x)

// Scans a side of a triangle setting min X and max X in ContourX[][]
// (using the Bresenham's line drawing algorithm).
void ScanLine(long x1, long y1, long x2, long y2)
{
  long sx, sy, dx1, dy1, dx2, dy2, x, y, m, n, k, cnt;

  sx = x2 - x1;
  sy = y2 - y1;

  if (sx > 0) dx1 = 1;
  else if (sx < 0) dx1 = -1;
  else dy1 = 0;

  if (sy > 0) dy1 = 1;
  else if (sy < 0) dy1 = -1;
  else dy1 = 0;

  m = ABS(sx);
  n = ABS(sy);
  dx2 = dx1;
  dy2 = 0;

  if (m < n)
  {
    m = ABS(sy);
    n = ABS(sx);
    dx2 = 0;
    dy2 = dy1;
  }

  x = x1; y = y1;
  cnt = m + 1;
  k = n / 2;

  while (cnt--)
  {
    if ((y >= 0) && (y < SCREEN_HEIGHT))
    {
      if (x < ContourX[y][0]) ContourX[y][0] = x;
      if (x > ContourX[y][1]) ContourX[y][1] = x;
    }

    k += n;
    if (k < m)
    {
      x += dx2;
      y += dy2;
    }
    else
    {
      k -= m;
      x += dx1;
      y += dy1;
    }
  }
}

void DrawTriangle(Point2D p0, Point2D p1, Point2D p2)
{
  int y;

  for (y = 0; y < SCREEN_HEIGHT; y++)
  {
    ContourX[y][0] = LONG_MAX; // min X
    ContourX[y][1] = LONG_MIN; // max X
  }

  ScanLine(p0.x, p0.y, p1.x, p1.y);
  ScanLine(p1.x, p1.y, p2.x, p2.y);
  ScanLine(p2.x, p2.y, p0.x, p0.y);

  for (y = 0; y < SCREEN_HEIGHT; y++)
  {
    if (ContourX[y][1] >= ContourX[y][0])
    {
      long x = ContourX[y][0];
      long len = 1 + ContourX[y][1] - ContourX[y][0];

      // Can draw a horizontal line instead of individual pixels here
      while (len--)
      {
        SetPixel(x++, y, p0.color);
      }
    }
  }
}

int main(void)
{
  Point2D p0, p1, p2;

  // clear the screen
  memset(Screen, ' ', sizeof(Screen));

  // generate random trinagle coordinates
  srand((unsigned)time(NULL));

  p0.x = rand() % SCREEN_WIDTH;
  p0.y = rand() % SCREEN_HEIGHT;

  p1.x = rand() % SCREEN_WIDTH;
  p1.y = rand() % SCREEN_HEIGHT;

  p2.x = rand() % SCREEN_WIDTH;
  p2.y = rand() % SCREEN_HEIGHT;

  // draw the triangle
  p0.color = '1';
  DrawTriangle(p0, p1, p2);

  // also draw the triangle's vertices
  SetPixel(p0.x, p0.y, '*');
  SetPixel(p1.x, p1.y, '*');
  SetPixel(p2.x, p2.y, '*');

  Visualize();

  return 0;
}