"""Export the recorded before/after sources into a disposable RN app."""
import json
from pathlib import Path
import shutil
import subprocess
import sys

here = Path(__file__).resolve().parent
repository = here.parent
app = Path(sys.argv[1]).resolve()
destination = app / 'dropdown-evidence'
if not (app / 'node_modules/react-native').is_dir():
    raise SystemExit('Install the React Native app dependencies first.')
if destination.exists():
    raise SystemExit('Refusing to overwrite an existing fixture directory.')
destination.mkdir()
for label, revision in [
    ('Before', '6a71aeb39afcae7464db210e019411fc65fda1df'),
    ('After', '9626d0c'),
]:
    target = destination / ('dropdown' + label)
    target.mkdir()
    archive = subprocess.Popen([
        'git', '-C', str(repository), 'archive', revision,
        'DropdownAlert.tsx', 'Queue.ts', 'assets',
    ], stdout=subprocess.PIPE)
    subprocess.run(['tar', '-x', '-C', str(target)], stdin=archive.stdout, check=True)
    archive.stdout.close()
    if archive.wait() != 0:
        raise SystemExit('Could not export the recorded source revision.')
shutil.copyfile(here / 'App.tsx', destination / 'App.tsx')
(destination / 'tsconfig.after.json').write_text(json.dumps({
    'extends': '../tsconfig.json',
    'include': ['dropdownAfter/DropdownAlert.tsx', 'dropdownAfter/Queue.ts'],
    'exclude': [],
    'compilerOptions': {'noEmit': True},
}, indent=2))
print('Prepared', destination)
print('Have the root App re-export ./dropdown-evidence/App.')
