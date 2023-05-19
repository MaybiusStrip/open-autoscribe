import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordingComponent } from './recording/recording.component';

const routes: Routes = [
  { path: '', component: RecordingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
