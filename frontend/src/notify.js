import 'toastr/build/toastr.css';
import 'sweetalert/dist/sweetalert.css';

import toastr from 'toastr';
import swal from 'sweetalert';

toastr.options = {
  positionClass: 'toast-bottom-right',
  preventDuplicates: true,
  timeOut: '2000',
};

export default {
  warning(config, success) {
    const defaults = {
      ...config,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Katkesta',
      confirmButtonColor: '#e08e0b',
      confirmButtonText: 'Jah!',
    };
    swal(defaults, success);
  },
  success(text) {
    toastr.success(text);
  },
  error(text) {
    toastr.error(text);
  },
};
