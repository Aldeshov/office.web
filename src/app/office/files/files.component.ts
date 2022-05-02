//Copyright Azat https://github.com/Aldeshov/office.web

import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import {CourseFile, User} from '../../shared/models';
import {AuthenticationService, FileService, UserService} from '../../shared/services'
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {Subject} from 'rxjs';
import {filter, pairwise, startWith, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})

export class FilesComponent implements OnInit, OnDestroy {
  // Current User
  @Input() user: User;

  loading = true;

  // To add File
  fileName = '';
  dirs = [];
  dirName = '';
  students: User[] = [];

  fileID = 0;

  //For Form adding file
  addFile = false;

  editFile = false;

  // Titles to Navigate
  title: Title[] = [];

  // Files Owner
  owner: User = null;

  // Objects: Files or Directories
  objects: Object[] = [];

  public destroyed = new Subject<any>();

  // Current Path
  path: string = '';

  constructor(private userService: UserService, private router: Router, private r: ActivatedRoute, private auth: AuthenticationService, private fileService: FileService) {
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      pairwise(),
      filter((events: RouterEvent[]) => events[0].url === events[1].url),
      startWith('Initial call'),
      takeUntil(this.destroyed)).subscribe(() => {
      this.fetchData();
    });
  }

  fetchData() {
    this.loading = true;
    // Getting Current path then Objects: from current url path
    try {
      this.path = decodeURIComponent(this.r.snapshot.paramMap.get('path')) || '%2F';
    } catch (error) {
      this.router.navigate(['/office/files/0/%2F']).then(() => {
      });
    }

    if (this.user.is_teacher && +this.r.snapshot.paramMap.get('teacher') == 0)
      this.router.navigate(['/office/files/' + this.user.id + '/' + this.r.snapshot.paramMap.get('path')]).then(() => {
      });

    this.fileService.getFiles(+this.r.snapshot.paramMap.get('teacher'), this.r.snapshot.paramMap.get('path')).subscribe(response => {
      this.func(response);
      this.loading = false;
    }, _ => {
      this.router.navigate(['/office/files/0/%2F']).then(() => {
      })
    })
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  func(files: CourseFile[]) {
    // Clear objects
    this.objects = [];

    if (+this.r.snapshot.paramMap.get('teacher') == 0 && this.user.is_student) {
      let teachList = []
      for (let i = 0; i < files.length; i++) {
        if (teachList.find(t => t == files[i].owner.id) == undefined) {
          this.objects.push({
            id: files[i].owner.id + '',
            fileID: files[i].id,
            name: files[i].owner.first_name + ' ' + files[i].owner.last_name,
            is_Dir: true,
            teacher: files[i].owner.id + '',
            path: '/%2F',
            ico: 'assets/images/types/teacher.ico'
          });
          teachList.push(files[i].owner.id);
        }
      }
    } else {
      this.get(files);
    }
    this.title = []
    //Pre Titles
    if (this.user.is_student) {
      this.title.push({title: 'Teachers', teacher: 0, path: '%2F'});
      if (+this.r.snapshot.paramMap.get('teacher') != 0) {
        this.title.push({
          title: files[0].owner.first_name + ' ' + files[0].owner.last_name,
          teacher: +this.r.snapshot.paramMap.get('teacher'),
          path: '%2F'
        });
      }
    }
    if (this.user.is_teacher) {
      this.title.push({
        title: this.user.first_name + ' ' + this.user.last_name,
        teacher: +this.r.snapshot.paramMap.get('teacher'),
        path: '%2F'
      })
    }
    // Next Titles
    this.titles();
  }

  // Adding Files(For Teacher)
  add() {
    this.addFile = true;
    document.getElementById('main').classList.add('disable');
    this.userService.getStudents().subscribe(response => this.students = response);
  }

  edit(id = 0, name = '') {
    this.editFile = true;
    document.getElementById('main').classList.add('disable');
    this.userService.getStudents().subscribe(response => this.students = response);
    this.fileName = name;
    this.fileID = id;
  }

  addDir() {
    if (this.dirName != '' && this.dirs.length < 4) {
      this.dirs.push(this.dirName);
    } else if (this.dirName != '' && this.dirs.length == 4) {
      alert('Max count of Folders!')
    }
    this.dirName = '';
  }

  getSelectValues(select) {
    const result = [];
    const options = select && select.options;
    let opt;

    let i = 0, iLen = options.length;
    for (; i < iLen; i++) {
      opt = options[i];

      if (opt.selected) {
        result.push(opt.value);
      }
    }
    return result;
  }

  save() {
    let selected = this.getSelectValues(document.getElementById('select'));
    if (this.fileName != '' && selected.length != 0) {
      let students = [];
      for (let i = 0; i < selected.length; i++) {
        students.push(this.students.find(student => student.id == selected[i]))
      }
      let path = this.path;

      for (let i = 0; i < this.dirs.length; i++) {
        if (path.length != 1) {
          path += '/';
        }
        path += this.dirs[i];
      }
      if (this.addFile) {
        this.fileService.addFile(this.fileName, path, students).subscribe(_ => {
          this.addFile = false;
          document.getElementById('main').classList.remove('disable');
          location.reload();
        })
      }
      if (this.editFile) {
        this.fileService.updateFile(this.fileID, this.fileName, path, students).subscribe(_ => {
          this.editFile = false;
          document.getElementById('main').classList.remove('disable');
          location.reload();
        })
      }
    }
  }

  delete() {
    this.fileService.deleteFile(this.fileID).subscribe(_ => {
      this.editFile = false;
      document.getElementById('main').classList.remove('disable');
      location.reload();
    })
  }

  // Titles
  // Adding until end of directory
  titles() {
    let k = 0;
    if (this.path != '/') {
      while (k != -1) {
        k += 1;
        let f = k;
        k = this.path.indexOf('/', k);
        if (k == -1) {
          this.title.push({
            title: this.path.substr(f),
            teacher: +this.r.snapshot.paramMap.get('teacher'),
            path: encodeURIComponent(this.path)
          })
        } else {
          this.title.push({
            title: this.path.substr(f, k - f),
            teacher: +this.r.snapshot.paramMap.get('teacher'),
            path: encodeURIComponent(this.path.substr(0, k))
          })
        }
      }
    }
  }

  // When clicked Object: Navigate -> Get objects and create titles
  route(obj: Object) {
    // If this is a Directory
    if (obj.is_Dir) {
      // Navigate with teacher and path information
      this.router.navigate(['/office/files/' + obj.teacher + '/' + obj.path]);
      // Create Title
      this.title.push({title: obj.name, teacher: +obj.teacher, path: obj.path})

      // If we are in Teachers path(For Student)
      if (obj.id == obj.teacher) {
        this.fileService.getFiles(+obj.id, this.r.snapshot.paramMap.get('path')).subscribe(files => this.get(files));
      } else {
        // If we in Main Path: '/' ('%2F' for URL)
        if (this.r.snapshot.paramMap.get('path') == '%2F') {
          this.path = this.path + obj.id
          this.fileService.getFiles(+this.r.snapshot.paramMap.get('teacher'), this.r.snapshot.paramMap.get('path') + obj.id).subscribe(files => this.get(files));
        } else {
          this.path = this.path + '/' + obj.id
          this.fileService.getFiles(+this.r.snapshot.paramMap.get('teacher'), this.r.snapshot.paramMap.get('path') + '%2F' + obj.id).subscribe(files => this.get(files));
        }
      }
    }
    // If this is a File
    else {
      if (this.user.is_teacher) {
        this.edit(obj.fileID, obj.name);
      }
        // That's just sample.
      // Here we can get file from server
      else {
        alert('This is a File');
      }
    }
  }

  go(title: Title): void {
    // Just go to (more precisely refresh) route
    this.router.navigate(['/office/files/' + title.teacher + '/' + title.path]);
  }

  // Just Getting Files and Directories From Array CourseFile[]
  get(files: CourseFile[]) {
    // Clear Objects to push new objects
    this.objects = [];
    // Temp array of directories: To avoid duplication
    let dirs: String[] = [];
    // Then iterate the CourseFiles(There may be files or directories)
    for (let i = 0; i < files.length; i++) {
      // More precisely -> condition means: (is this a File?)
      if (this.path == files[i].path) {
        // Then We get Type of File. For example .doc or .txt
        let type: string = '';
        if (files[i].name.indexOf('.') != -1) {
          for (let j = 0; j < files[i].name.length; j++) {
            if (files[i].name[files[i].name.length - j - 1] == '.') {
              break;
            }
            type += files[i].name[files[i].name.length - j - 1];
          }
        }
        type = type.split('').reverse().join('');

        // Let give to object ico using type
        let icon = 'assets/images/types/unknown.ico';

        if (type == 'doc' || type == 'docx') {
          icon = 'assets/images/types/doc.ico';
        }

        if (type == 'xls' || type == 'xlsx') {
          icon = 'assets/images/types/xls.ico';
        }

        if (type == 'txt' || type == 'md') {
          icon = 'assets/images/types/txt.ico';
        }

        if (type == 'ppt' || type == 'pptx') {
          icon = 'assets/images/types/ppt.ico';
        }

        if (type == 'pdf') {
          icon = 'assets/images/types/pdf.png';
        }

        if (type == 'rar' || type == 'zip') {
          icon = 'assets/images/types/rar.png';
        }

        // Temp for a file name to cut(if characters length more than 15 )
        let temp = files[i].name;

        if (temp.length > 15) {
          temp = temp.substr(0, 7) + '...' + temp.substr(temp.length - 4, 4);
        }
        // Let push our Object: File
        this.objects.push({
          id: files[i].name,
          fileID: files[i].id,
          name: temp,
          is_Dir: false,
          teacher: this.r.snapshot.paramMap.get('teacher'),
          path: this.r.snapshot.paramMap.get('path') + '%2F' + files[i].id,
          ico: icon
        });
      }
      // Here we get Directory
      else {
        // Getting Directory Name
        let temp: string = '';
        let l = this.path;
        if (this.path != '/') {
          l += '/';
        }
        for (let j = l.length; j < files[i].path.length; j++) {
          if (files[i].path[j] == '/') {
            break;
          } else {
            temp += files[i].path[j]
          }
        }
        // WE got Directory name: temp

        // WE must check: had we add the same directory(temp) to objects
        if (dirs.find(d => d == temp) == undefined) {
          // If not then we add the new directory
          dirs.push(temp);
          // Getting name(cut or full)
          let full = temp;
          if (temp.length > 15) {
            temp = temp.substr(0, 7) + '...' + temp.substr(temp.length - 4, 4);
          }
          // Let push our Directory
          // Difference between conditions(bottom): that path name
          // (1) If we in the main path(Where just '/' ('%2F' is the url adding),
          // we don't add slash (For example "'/' + 'New Directory Name'"),
          // (2) otherwise we add (For example "'/Directory' + '/' + 'New Directory Name'"))
          if (this.r.snapshot.paramMap.get('path') == '%2F') {
            // (1)
            this.objects.push({
              id: full,
              fileID: 0,
              name: temp,
              is_Dir: true,
              teacher: this.r.snapshot.paramMap.get('teacher'),
              path: this.r.snapshot.paramMap.get('path') + full,
              ico: 'assets/images/types/folder.ico'
            });
          } else {
            // (2)
            this.objects.push({
              id: full,
              fileID: 0,
              name: temp,
              is_Dir: true,
              teacher: this.r.snapshot.paramMap.get('teacher'),
              path: this.r.snapshot.paramMap.get('path') + '%2F' + full,
              ico: 'assets/images/types/folder.ico'
            });
          }
        }
      }
    }
  }

  // Exit from file adding
  cancel() {
    this.addFile = false;
    this.editFile = false;
    this.fileName = '';
    this.fileID = 0;
    document.getElementById('main').classList.remove('disable');
  }
}

// Object interface for Files and Directories or Teachers(For Student)
interface Object {
  id: string;
  fileID: number;
  name: string;
  is_Dir: boolean;
  teacher: string;
  path: string;
  ico: string;
}

// Title interface for navigation
interface Title {
  title: string;
  teacher: number;
  path: string;
}
