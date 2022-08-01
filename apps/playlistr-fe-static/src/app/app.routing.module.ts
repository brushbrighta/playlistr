import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          children: [
            {
              path: '',
              redirectTo: 'apple-music',
              pathMatch: 'full'
            },
            {
              path: 'apple-music',
              loadChildren: () =>
                import('@playlistr/fe/apple-music/shell').then((m) => m.FeAppleMusicShellModule),
            },
          ]
        }
      ],
      {
        enableTracing: false,
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
